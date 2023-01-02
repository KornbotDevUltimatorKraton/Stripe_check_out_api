import stripe
from flask import Flask,render_template,url_for,redirect,jsonify,request 
app = Flask(__name__)
stripe.api_key ='sk_test_51MFwAsDwkKIbSR1R0IdfbfVMNCVOX8ljOxIyb44b4deK04FVKvHRRw7dIoFqh3JEQGVbtFdBkkZpPgGhLphSr7wH00mBcXTIFW'

@app.route("/")
def index():

      return render_template("index.html")
@app.route('/create-checkout-session', methods=['POST'])
def create_checkout_session(): 
  input_status = request.get_json()
  session = stripe.checkout.Session.create(
    line_items=[{
      'price_data': {
        'currency': 'thb',
        'product_data': {
          'name': 'Roboreactor_genflow_minis',
        },
        'unit_amount': 93700,
      },
      'quantity': 1,
    }],
    mode='payment',
    success_url='http://192.168.50.192:5890/success',
    cancel_url='http://192.168.50.192:5890/cancel',
  )
  #change the success into the plugin 
  print(session)
  print(session.url)
  # Getting the unpaid status data from the json rethrieved data from the session list 
  return jsonify({'url':session.url})
@app.route("/success") 
def Success_mode():
     # Whole of these code will add into the login as the success page to alert  
     #Getting the list of the success payment to save the current user payment into the database 
     charged = stripe.Charge.list(limit=1)  
     print(charged)  # Add the charged retrieved 
     return "Success!"

@app.route("/cancel")
def Cancel_mode():
      
      return "Cancel!"
@app.route("/Payment_form")
def Account_form():

      return render_template("form.html")

if __name__=="__main__":

       app.run(debug=True,threaded=True,host="0.0.0.0",port=5890) 
