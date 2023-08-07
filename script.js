const addStuffToContents = () => {
	const bookElements = document.querySelectorAll('.books > [class^="book"]');
	bookElements.forEach((bookElement) => {
	  const imgElement = document.createElement('img');
	  imgElement.src = 'Assets/SVG/' + bookElement.id + '.svg';
	  imgElement.setAttribute('draggable', 'false');
	  bookElement.appendChild(imgElement);
	});

	// Check if the alert has been shown before
	if (!localStorage.getItem('alertShown')) {
	// If not shown, display the alert box
	alert('Welcome to The One Page Bible! click and drag to pan, and scroll in/out to Zoom');
  
	// Set a flag in localStorage to indicate that the alert has been shown
	localStorage.setItem('alertShown', 'true');
  	}

  };
  
  const grid = document.querySelector('.grid');
  const contents = document.querySelector('.contents');
  const gridSize = grid.getBoundingClientRect();
  
  let panningAllowed = false;
  let zoomFactor = 1;
  
  const translate = { scale: zoomFactor, translateX:0, translateY:0 };
  const initialContentsPos = { x:0, y:0 };
  const initialZoomPos = { x:0, y:0 };
  const pinnedMousePosition = { x:0, y:0 };
  const mousePosition = { x:0, y:0 };
  
  const mousedown = (event) => {
	initialContentsPos.x = translate.translateX;
	initialContentsPos.y = translate.translateY;
	pinnedMousePosition.x = event.clientX;
	pinnedMousePosition.y = event.clientY;
	panningAllowed = true;
  };
  
  const mousemove = (event) => {
	mousePosition.x = event.clientX;
	mousePosition.y = event.clientY;
	if (panningAllowed) {
	  const diffX = (mousePosition.x - pinnedMousePosition.x);
	  const diffY = (mousePosition.y - pinnedMousePosition.y);
	  translate.translateX = initialContentsPos.x + diffX;
	  translate.translateY = initialContentsPos.y + diffY;
	}
	update();
  };
  
  const mouseup = (event) => {
	panningAllowed = false;
  };
  
  const zoom = (event) => {
	if (zoomFactor + (event.deltaY / 5000) > 6 || zoomFactor + (event.deltaY / 5000) < 0.01) {
	  return;
	}
	const oldZoomFactor = zoomFactor;
	zoomFactor += event.deltaY / 5000;
	mousePosition.x = event.clientX - gridSize.x;
	mousePosition.y = event.clientY - gridSize.y;
	translate.scale = zoomFactor;
	const contentMousePosX = mousePosition.x - translate.translateX;
	const contentMousePosY = mousePosition.y - translate.translateY;
	const x = mousePosition.x - contentMousePosX * (zoomFactor / oldZoomFactor);
	const y = mousePosition.y - contentMousePosY * (zoomFactor / oldZoomFactor);
	translate.translateX = x;
	translate.translateY = y;
	update();
  };
  
  const update = () => {
	const matrix = `matrix(${translate.scale}, 0, 0, ${translate.scale}, ${translate.translateX}, ${translate.translateY})`;
	contents.style.transform = matrix;
  };
  
  addStuffToContents();
  grid.addEventListener('wheel', zoom);
  grid.addEventListener('mousedown', mousedown);
  grid.addEventListener('mousemove', mousemove);
  grid.addEventListener('mouseup', mouseup);
  
  // Helper / Utility functions
let url_to_head = (url) => {
    return new Promise(function(resolve, reject) {
        var script = document.createElement('script');
        script.src = url;
        script.onload = function() {
            resolve();
        };
        script.onerror = function() {
            reject('Error loading script.');
        };
        document.head.appendChild(script);
    });
}
let handle_close = (event) => {
    event.target.closest(".ms-alert").remove();
}
let handle_click = (event) => {
    if (event.target.classList.contains("ms-close")) {
        handle_close(event);
    }
}
document.addEventListener("click", handle_click);
const paypal_sdk_url = "https://www.paypal.com/sdk/js";
const client_id = "REPLACE_WITH_YOUR_CLIENT_ID";
const currency = "USD";
const intent = "capture";
let alerts = document.getElementById("alerts");

//PayPal Code
//https://developer.paypal.com/sdk/js/configuration/#link-queryparameters
url_to_head(paypal_sdk_url + "?client-id=" + client_id + "&enable-funding=venmo&currency=" + currency + "&intent=" + intent)
.then(() => {
    //Handle loading spinner
    document.getElementById("loading").classList.add("hide");
    document.getElementById("content").classList.remove("hide");
    let alerts = document.getElementById("alerts");
    let paypal_buttons = paypal.Buttons({ // https://developer.paypal.com/sdk/js/reference
        onClick: (data) => { // https://developer.paypal.com/sdk/js/reference/#link-oninitonclick
            //Custom JS here
        },
        style: { //https://developer.paypal.com/sdk/js/reference/#link-style
            shape: 'rect',
            color: 'gold',
            layout: 'vertical',
            label: 'paypal'
        },

        createOrder: function(data, actions) { //https://developer.paypal.com/docs/api/orders/v2/#orders_create
            return fetch("http://localhost:3000/create_order", {
                method: "post", headers: { "Content-Type": "application/json; charset=utf-8" },
                body: JSON.stringify({ "intent": intent })
            })
            .then((response) => response.json())
            .then((order) => { return order.id; });
        },

        onApprove: function(data, actions) {
            let order_id = data.orderID;
            return fetch("http://localhost:3000/complete_order", {
                method: "post", headers: { "Content-Type": "application/json; charset=utf-8" },
                body: JSON.stringify({
                    "intent": intent,
                    "order_id": order_id
                })
            })
            .then((response) => response.json())
            .then((order_details) => {
                console.log(order_details); //https://developer.paypal.com/docs/api/orders/v2/#orders_capture!c=201&path=create_time&t=response
                let intent_object = intent === "authorize" ? "authorizations" : "captures";
                //Custom Successful Message
                alerts.innerHTML = `<div class=\'ms-alert ms-action\'>Thank you ` + order_details.payer.name.given_name + ` ` + order_details.payer.name.surname + ` for your payment of ` + order_details.purchase_units[0].payments[intent_object][0].amount.value + ` ` + order_details.purchase_units[0].payments[intent_object][0].amount.currency_code + `!</div>`;

                //Close out the PayPal buttons that were rendered
                paypal_buttons.close();
             })
             .catch((error) => {
                console.log(error);
                alerts.innerHTML = `<div class="ms-alert ms-action2 ms-small"><span class="ms-close"></span><p>An Error Ocurred!</p>  </div>`;
             });
        },

        onCancel: function (data) {
            alerts.innerHTML = `<div class="ms-alert ms-action2 ms-small"><span class="ms-close"></span><p>Order cancelled!</p>  </div>`;
        },

        onError: function(err) {
            console.log(err);
        }
    });
    paypal_buttons.render('#payment_options');
})
.catch((error) => {
    console.error(error);
});