$(document).ready(function() {

  // Product data to be used in shop and in cart
  var products = {
    'Spy Magnifying Glass' : ['Spy Magnifying Glass', "A specially shaped piece of glass used to make an object look larger than it is.", 499, 'assets/magni.png', 1],
    'Mini Gps' : ['Mini GPS Tracker', "The mini gps tracker will provide exact location of whatever you are tracking right on Google Maps!", 1599, 'assets/gps.png', 2],  
    'HD Focus Spy Pen' : ['HD Focus Spy Pen', "A spy pen is a functioning ink pen that also has a video camera above the pocket clip. ", 999, 'assets/spy.png', 3],
    'Binoculars' : ['Binoculars', "Binoculars, optical instrument, usually handheld, for providing a magnified stereoscopic view of distant objects.",9999, 'assets/binocu.png', 4],
    'Spy Pen' : ['DSLR HD Camera', "DSLRs use a digital sensor to capture images, which are then stored on a memory card.", 31199, 'assets/cam.png', 5],
    'Leather Gloves' : ['Leather Gloves', "These gloves are made from good quality of leather and protection against cut and puncture resistance.", 699, 'assets/glov.png', 6]
  };  
  
  // Populates shop with items based on template and data in var products
  
  var $shop = $('.shop');
  var $cart = $('.cart-items');
  
  for(var item in products) {
    var itemName = products[item][0],
        itemDescription = products[item][1],
        itemPrice = products[item][2],
        itemImg = products[item][3],
        itemId = products[item][4],
        $template = $($('#productTemplate').html());
    
    $template.find('h1').text(itemName);
    $template.find('p').text(itemDescription);
    $template.find('.price').text('₹ ' + itemPrice);
    $template.css('background-image', 'url(' + itemImg + ')');
    $template.css('background-size', 'contain');
    $template.css('background-repeat', 'no-repeat');
    $template.css('font-family', 'poppins');
    
    $template.data('id', itemId);
    $template.data('name', itemName);
    $template.data('price', itemPrice);
    $template.data('image', itemImg);
    
    
    $shop.append($template);
  }
  
  // Checks quantity of a cart item on input blur and updates total
  // If quantity is zero, item is removed
  
  $('body').on('blur', '.cart-items input', function() {
    var $this = $(this),
        $item = $this.parents('li');
    if (+$this.val() === 0) {
      $item.remove();
    } else {
      calculateSubtotal($item);
    }
    updateCartQuantity();
    calculateAndUpdate();
  });
  
  // Add item from the shop to the cart
  // If item is already in the cart, +1 to quantity
  // If not, creates the cart item based on template
  
  $('body').on('click', '.product .add', function() {
    var items = $cart.children(),
        $item = $(this).parents('.product'),
        $template = $($('#cartItem').html()),
        $matched = null,
        quantity = 0;
    
    $matched = items.filter(function(index) {
      var $this = $(this);
      return $this.data('id') === $item.data('id');
    });
   
    if ($matched.length) {
      quantity = +$matched.find('.quantity').val() + 1;
      $matched.find('.quantity').val(quantity);
      calculateSubtotal($matched);
    } else {
      $template.find('.cart-product').css('background-image', 'url(' + $item.data('image') + ')');
      $template.find('h3').text($item.data('name'));
      $template.find('.subtotal').text('₹' + $item.data('price'));
    
      $template.data('id', $item.data('id'));
      $template.data('price', $item.data('price'));
      $template.data('subtotal', $item.data('price'));
      
      $cart.append($template);
    }
    
    updateCartQuantity();
    calculateAndUpdate();
  });

  // Calculates subtotal for an item
  
  function calculateSubtotal($item) {
    var quantity = $item.find('.quantity').val(),
        price = $item.data('price'),
        subtotal = quantity * price;
    $item.find('.subtotal').text('₹' + subtotal);
    $item.data('subtotal', subtotal);
  } 
    
  // Clicking on the cart link opens up the shopping cart
  
  var $cartlink = $('.cart-link'), $wrap = $('#wrap');
  
  $cartlink.on('click', function() {
    $cartlink.toggleClass('active');
    $wrap.toggleClass('active');
    return false;    
	});
  
  // Clicking outside the cart closes the cart, unless target is the "Add to Cart" button 
 
  $wrap.on('click', function(e){
    if (!$(e.target).is('.add')) {
      $wrap.removeClass('active');
      $cartlink.removeClass('active');
    }
  });
 
  // Calculates and updates totals, taxes, shipping
  
  function calculateAndUpdate() {
    var subtotal = 0,
        items = $cart.children(),
        // shipping not applied if there are no items
        shipping = items.length > 0 ? 50 : 0,
        tax = 0;
    items.each(function(index, item) {
      var $item = $(item),
          price = $item.data('subtotal');
      subtotal += price;
    });
    $('.subtotalTotal span').text(('₹'+subtotal));
    tax = Math.round(subtotal * .12);
    $('.taxes span').text(('₹'+tax));
    $('.shipping span').text(('₹'+shipping));
    $('.finalTotal span').text(('₹'+(subtotal + tax + shipping)));
  }

  //  Update the total quantity of items in notification, hides if zero
  
  function updateCartQuantity() {
    var quantities = 0,
        $cartQuantity = $('span.cart-quantity'),
        items = $cart.children();
    items.each(function(index, item) {
      var $item = $(item),
          quantity = +$item.find('.quantity').val();
      quantities += quantity;
    });
    if(quantities > 0){
      $cartQuantity.removeClass('empty');
    } else {
      $cartQuantity.addClass('empty');
    }
    $cartQuantity.text(quantities);
  }
  
 
  //  Formats number into dollar format
     
  function formatDollar(amount) {
    return '$' + parseFloat(Math.round(amount * 100) / 100).toFixed(2);
  }
  
  // Restrict the quantity input field to numbers only
     
  $('body').on('keypress', '.cart-items input', function (ev) {
      var keyCode = window.event ? ev.keyCode : ev.which;
      if (keyCode < 48 || keyCode > 57) {
        if (keyCode != 0 && keyCode != 8 && keyCode != 13 && !ev.ctrlKey) {
          ev.preventDefault();
        }
      }
    });
  
  // Trigger animation on Add to Cart button click
  
  $('.addtocart').on('click', function () {
    $(this).addClass('active');
    setTimeout(function () {
      $('.addtocart').removeClass('active');    
    }, 1000);
  });
  
  // Trigger error animation on Checkout button
  
  $('.checkout').on('click', function () {
    $(this).addClass('active');
    $('.error').css('display', 'block');
    setTimeout(function () {
      $('.checkout').removeClass('active');    
      $('.error').css('display', 'none');      
    }, 1000);
  });    
  
});