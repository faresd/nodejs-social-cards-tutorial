var utils = require('./utils');


exports.pageUrlFromRequest = function(req){
    return function(doc) {
        var host = req.get('host')
        var scheme = "http://";
        return scheme + host + '/' + doc.uid
    }
}


exports.isShareReady = function(doc) {
    var socialData = social(doc);
    return socialData && socialData.length > 0;
}


exports.openGraphCardExists = function(doc) {
    var socialSlices = social(doc);
    if(socialSlices) {
        return utils.exists(socialSlices, function(slice) {
            return isOpenGraphCard(slice.sliceType)
        })
    }
    return false;
}

function isOpenGraphCard(sliceType) {
    return (sliceType == 'general_card' || sliceType == 'product_card' || sliceType == 'place_card');
}

exports.openGraphCardType = function(doc) {
    var socialSlices = social(doc);
    if(socialSlices) {
        var slice = utils.findFirst(socialSlices, function(slice) {
            return isOpenGraphCard(slice.sliceType)
        })
        return slice.sliceType
    }
}

function generalCard(doc) {
    var socialSlices = social(doc);
    if(socialSlices) {
        var slice = utils.findFirst(socialSlices, function(slice) {
            return slice.sliceType == "general_card"
        })
        return slice
    }
}

exports.generalCardTitle = function(doc) {
    return generalCard(doc).value.toArray()[0].get('card_title') ? generalCard(doc).value.toArray()[0].get('card_title').value : defaultTitle(doc);
}

exports.generalCardImage = function(doc) {
    return generalCard(doc).value.toArray()[0].get('card_image') && generalCard(doc).value.toArray()[0].get('card_image').getView("main") ? generalCard(doc).value.toArray()[0].get('card_image').getView("main").url : defaultImage(doc);
}

exports.generalCardDescription = function(doc) {
    return generalCard(doc).value.toArray()[0].get('card_description') ? generalCard(doc).value.toArray()[0].get('card_description').value : defaultDescription(doc);
}


function productCard(doc) {
    var socialSlices = social(doc);
    if(socialSlices) {
        var slice = utils.findFirst(socialSlices, function(slice) {
            return slice.sliceType == "product_card"
        })
        return slice
    }
}


exports.productCardTitle = function(doc) {
    return productCard(doc).value.toArray()[0].get('card_title') ? productCard(doc).value.toArray()[0].get('card_title').value : defaultTitle(doc);
}

exports.productCardDescription = function(doc) {
    return productCard(doc).value.toArray()[0].get('card_description') ? productCard(doc).value.toArray()[0].get('card_description').value : defaultDescription(doc);
}

exports.productCardAmount = function(doc) {
    return productCard(doc).value.toArray()[0].get('card_amount') ? productCard(doc).value.toArray()[0].get('card_amount').value : '';
}

exports.productCardCurrency = function(doc) {
    return productCard(doc).value.toArray()[0].get('card_currency') ? productCard(doc).value.toArray()[0].get('card_currency').value : '';
}

exports.productCardSingleImage = function(doc) {
    return productCard(doc).value.toArray()[0].get('card_image0') && productCard(doc).value.toArray()[0].get('card_image0').getView("main") ? productCard(doc).value.toArray()[0].get('card_image0').getView("main").url : defaultImage(doc);
}

exports.productCardImages =  function(doc){
    var imagesUrls = getImagesFromSlice(productCard(doc)).map(function(image) {
        return image.getView('main').url
    })

    return '[' +  imagesUrls.join() + ']';
}

function placeCard(doc) {
    var socialSlices = social(doc);
    if(socialSlices) {
        var slice = utils.findFirst(socialSlices, function(slice) {
            return slice.sliceType == "place_card"
        })
        return slice
    }
}

exports.placeCardTitle = function(doc) {
    return placeCard(doc).value.toArray()[0].get('card_title') ? placeCard(doc).value.toArray()[0].get('card_title').value : defaultTitle(doc);
}

exports.placeCardDescription = function(doc) {
    return placeCard(doc).value.toArray()[0].get('card_description') ? placeCard(doc).value.toArray()[0].get('card_description').value : defaultDescription(doc);
}

exports.placeCardLatitude = function(doc) {
    return placeCard(doc).value.toArray()[0].get('coordinates') ? placeCard(doc).value.toArray()[0].get('coordinates').latitude: defaultDescription(doc);
}

exports.placeCardLongitude = function(doc) {
    return placeCard(doc).value.toArray()[0].get('coordinates') ? placeCard(doc).value.toArray()[0].get('coordinates').longitude: defaultDescription(doc);
}

exports.placeCardImage = function(doc) {
    return placeCard(doc).value.toArray()[0].get('card_image') && placeCard(doc).value.toArray()[0].get('card_image').getView("main") ? placeCard(doc).value.toArray()[0].get('card_image').getView("main").url : defaultImage(doc);
}

function social(doc) {
    if(!doc) {
        return;
    }
    if(doc.getSliceZone(doc.type + '.social')) {
        var socialData = doc.getSliceZone(doc.type + '.social').value;
        if(socialData) {
            return socialData;
        }
    } else return;

}