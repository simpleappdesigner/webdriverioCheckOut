const Page = require('./page');
class CartPage extends Page {
    /*
    * define selectors using getter methods
    */
    get link_continue_shopping () {return $('a=Continue shopping')}
    get link_proceed_checkout () {return $('a=Proceed to checkout')}

  async validate_cart () {
    var table = await $('table.shop_table');
        console.log("Cart validations, start ---");
        // col mapping
        // Cost per unit #3
        // Quantity # 4
        // cost times quantity # 5
        // find all the rows
        var sub_total_all_rows=0;
        var rows=table.$$('tr');
        var total_rows= await rows.length;
        for (let i = 0; i < total_rows; i++) {
            var row=rows[i];
            var cols=await row.$$('td');
            //console.log(i);
            var cost_per_unit=0;
            var quantity=0;
            var sub_total_row=0;
            var product_desc="";
            for (let j = 0; j < cols.length; j++) {
                var text_value=await cols[j].getText();
                //console.log(j,":",text_value);
                if (text_value=='APPLY COUPON'){ break}
                if (j ==2){ 
                    product_desc=text_value;
                }

                if (j ==3){ 
                    cost_per_unit=parseFloat(text_value.replace("$",""));
                }
                if (j == 4) // Quantity # 4
                {
                    quantity =parseFloat(await cols[j].$('input.input-text').getAttribute('value'));
                    //console.log("Quantity:",quantity);
                }
                if (j ==5){ 
                    sub_total_row=parseFloat(text_value.replace("$",""));
                }
            }
            //console.log(cost_per_unit,quantity,sub_total_row);
            var result= cost_per_unit * quantity;
            //console.log("Result:",result);
            console.log(`Row# ${i} ==> Product: ${product_desc}, Cost per unit: ${cost_per_unit} , Quantity: ${quantity} , Sub Total Row: ${sub_total_row}, Calculated value per row: ${result}`);
            //expect(result).to.equal(sub_total_row);
            expect(result).toHaveValue(sub_total_row);
            sub_total_all_rows=sub_total_all_rows+sub_total_row;

          } //end of for loop


          var table = await $$('table.shop_table')[1];

        // col mapping
        // Cost per unit #3
        // Quantity # 4
        // cost times quantity # 5
        // find all the rows
        var sub_total_all_rows=0;
        rows=table.$$('tr');
        total_rows= await rows.length;
        var ct_subtotal=0;
        var ct_flat_rate=0;
        var ct_tax = 0;
        var ct_total = 0;
        // cart totals
        for (let i = 0; i < total_rows; i++) {
            row=rows[i];
            cols=await row.$$('td');
            //console.log(i);
            /*
            i==0, subtotal
            i==1, flat rate
            i==2, tax
            i==3  total
            */
            var col=cols[0];
            var text_value=await col.getText();
            var regex = /[+-]?\d+(\.\d+)?/g;
            text_value.replace("$","");
            text_value=text_value.replace("$","");
            //console.log("text_value",text_value);
            

            if (i == 0)
            {
                ct_subtotal=parseFloat(text_value);
                //console.log("ct_subtotal:",ct_subtotal);
                expect(ct_subtotal).toHaveValue(sub_total_all_rows);
            }
            if (i == 1)
            {
                ct_flat_rate = text_value.match(regex).map(function(v) { return parseFloat(v); });
                ct_flat_rate=ct_flat_rate[0];
                //ct_flat_rate=parseFloat(text_value);
                //console.log("Flat_rate:",ct_flat_rate);
            }
            if (i == 2)
            {
                ct_tax=parseFloat(text_value);
                //console.log("ct_tax:",ct_tax);
            }
            if (i == 3)
            {
                ct_total=parseFloat(text_value);
                //console.log("ct_total:",ct_total);
            }
            
            

          } //end of for loop cart totals
          var calculated_total= ct_subtotal + ct_flat_rate + ct_tax;
          console.log(`CART TOTALS ==> Subtotal: ${ct_subtotal} , Shipping: ${ct_flat_rate} , Tax: ${ct_tax}, Total: ${ct_total},Calculated total: ${calculated_total}`);

          console.log("Cart validations, completes ---");
          return [ct_subtotal,ct_flat_rate,ct_tax,ct_total,calculated_total];

    } //end of validate cart function
}

module.exports = new CartPage();