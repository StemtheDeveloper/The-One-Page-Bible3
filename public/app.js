paypal
  .Buttons({
    // Sets up the transaction when a payment button is clicked
    createOrder: function (data, actions) {
      return fetch("/api/orders", {
        method: "post",
      })
        .then((response) => response.json())
        .then((order) => order.id);
    },
    // Finalize the transaction after payer approval
    onApprove: function (data, actions) {
      return fetch(`/api/orders/${data.orderID}/capture`, {
        method: "post",
      })
        .then((response) => response.json())
        .then((orderData) => {
          console.log(
            "Capture result",
            orderData,
            JSON.stringify(orderData, null, 2)
          );
          const transaction = orderData.purchase_units[0].payments.captures[0];
          alert(`Transaction ${transaction.status}: ${transaction.id}

            See console for all available details
          `);
        });
    },
  })
  .render("#paypal-button-container");
// If this returns false or the card fields aren't visible, see Step #1.
if (paypal.HostedFields.isEligible()) {
  let orderId;

  // Renders card fields
  paypal.HostedFields.render({
    createOrder: () => {
      return fetch("/api/orders", {
        method: "post",
      })
        .then((res) => res.json())
        .then((orderData) => {
          orderId = orderData.id; // needed later to complete capture
          return orderData.id;
        });
    },
    styles: {
      ".valid": {
        color: "green",
      },
      ".invalid": {
        color: "red",
      },
    },
    fields: {
      number: {
        selector: "#card-number",
        placeholder: "4111 1111 1111 1111",
      },
      cvv: {
        selector: "#cvv",
        placeholder: "123",
      },
      expirationDate: {
        selector: "#expiration-date",
        placeholder: "MM/YY",
      },
    },
  }).then((cardFields) => {
    document.querySelector("#card-form").addEventListener("submit", (event) => {
      event.preventDefault();
      cardFields
        .submit({
          // Cardholder's first and last name
          cardholderName: document.getElementById("card-holder-name").value,
          // Billing Address
          billingAddress: {
            countryCodeAlpha2: document.getElementById(
              "card-billing-address-country"
            ).value,
          },
        })
        .then((payload) => {
          console.log(`3DS-CONTINGENCY: liabilityShifted: ${payload.liabilityShifted} | authenticationStatus: ${payload.authenticationStatus} | authenticationReason: ${payload.authenticationReason} | Payload: ${JSON.stringify(payload)}`);
          var redirectURL = "review?token=" + orderId;
          var threeDSLiabilityShifted = '';
          var threeDSAuthenticationStatus = '&3ds_auth_status=' + payload.authenticationStatus;
          var threeDSAuthenticationReason = '&3ds_auth_reason=' + payload.authenticationReason;
          redirectURL = redirectURL + threeDSAuthenticationStatus + threeDSAuthenticationReason;

          if (payload.liabilityShifted) {
              threeDSLiabilityShifted = '&3ds_liability_shifted=true';
              redirectURL += threeDSLiabilityShifted;
          }
          // No 3DS Contingency Triggered
          if (payload.liabilityShifted === undefined) {
              threeDSLiabilityShifted = '&3ds_liability_shifted=undefined';
              redirectURL += threeDSLiabilityShifted;
          }
          // 3DS Contingency Triggered + Buyer skipped* 3DS
          if (payload.liabilityShifted === false) {
              threeDSLiabilityShifted = '&3ds_liability_shifted=false';
              redirectURL += threeDSLiabilityShifted;
          }
//        console.log(redirectURL);
        redirect='http://localhost:8888/success';
        href='https://www.sandbox.paypal.com/webapps/helios?action=verify&flow=3ds&cart_id='+orderId+'&redirect_uri='+redirect;
//        document.getElementById('threeds').innerHTML="<Iframe src="+href+" />";
          forthreeds = "<Dialog open> <a href='#' onclick=captureOrder(\'"+orderId+"\')>Close</a> <Iframe height=\"500\" width=\"500\" src="+href+" sandbox=\"allow-scripts allow-popups allow-same-origin\" referrerpolicy=\"origin\" /> </Dialog>";
          document.getElementById('threeds').innerHTML=forthreeds;
        })
        .catch((err) => {
          var msg = err.details[0].description;
          alert("Payment could not be captured! \n Error - "+msg+" Debug ID - "+err.debug_id);
        });
    });
  });
} else {
  // Hides card fields if the merchant isn't eligible
  document.querySelector("#card-form").style = "display: none";
}
function captureOrder(orderId) {
document.getElementById('threeds').remove();
fetch(`/api/orders/${orderId}/capture`, {
             method: "post",
           })
             .then((res) => res.json())
             .then((orderData) => {
               const errorDetail =
                 Array.isArray(orderData.details) && orderData.details[0];
               if (errorDetail) {
                 var msg = "Sorry, your transaction could not be processed.";
                 if (errorDetail.description)
                   msg += "\n\n" + errorDetail.description;
                 if (orderData.debug_id) msg += " (" + orderData.debug_id + ")";
                 return alert(msg); // Show a failure message
               }
               alert("Transaction completed! Transaction ID - "+orderData.id);
             });
             }