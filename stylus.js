function(obj, parse) {
    var generarProducto = function(empresa, prefijo, transformarPrecio) {
        var product = parse(obj);
        if(!product.$updatableProperties) {
           product.$updatableProperties = [];
        }
        product.$updatableProperties.push("prices");
        product.$updatableProperties.push("stocks");
        product.$updatableProperties.push("brand");
        product.$updatableProperties.push("pictures");
        if(!product.pictures) {
           product.pictures = [];
        }
        product.pictures.push({
            url: "http://www.stylus.com.ar/productos/imagenes/" + product.sku + ".jpg"
        }, {
            url: "http://mla-s1-p.mlstatic.com/567911-MLA20659020497_042016-O.jpg"
        });
        product.sku = empresa + prefijo + product.sku;
        var iva = 0;
        obj[15] == "G" ? iva = 21 : iva = 10.5;
        var impuestos = 0;
        obj[18] == "S" ? impuestos = 20.48 : impuestos = 0;
        var amountBase = obj[9];
        var dollarAmount = Math.round((parseFloat(amountBase) * (1 + parseFloat(iva) / 100) * (1 + parseFloat(impuestos) / 100) * 30) / 0.78) 
        var pesosAmount = Math.round((parseFloat(amountBase) * (1 + parseFloat(iva) / 100) * (1 + parseFloat(impuestos) / 100)) / 0.78);
        if (amountBase && amountBase != 0) {
            var amount = obj[22] == 1 ? transformarPrecio(dollarAmount) : transformarPrecio(pesosAmount);
            product.prices = [{
                amount: amount,
                priceList: "Default"
            }, {
                amount: Math.round(amount * 1.04),
                priceList: "ICBC"
            }];
        };
        if (amountBase == 0) {
            product.brand = "Stylus - Sin precio"
        } else {
            product.brand = prefijo + "Stylus"
        };
        return product;
    }
    var sumar = function(amount) {
        return amount + 230;
    }
    var productoNormal = generarProducto("STY-", "", _.identity);

    var sinFreeShipping = [productoNormal].filter(function(it) {
        return it.prices && it.prices[0].amount < 1400;
    }) ;

    return [generarProducto("STY-", "FS-", sumar)].concat(sinFreeShipping);
}
