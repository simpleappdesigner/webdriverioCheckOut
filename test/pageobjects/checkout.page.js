const Page = require('./page');
class CheckOUt extends Page {
    /*
    * define selectors using getter methods
    */
    get billing_fname () {return $('#billing_first_name')}
    get billing_lname () {return $('#billing_last_name')} 

    get billing_bc () {return $('#billing_country')}
    get billing_ba1 () {return $('#billing_address_1')}
    get billing_bcity () {return $('#billing_city')}
    get billing_st () {return $('#billing_state')}
    get billing_post () {return $('#billing_postcode')}
    get billing_phone () {return $('#billing_phone')}
    get billing_email () {return $('#billing_email')}
    get billing_comment () {return $('#order_comments')}

    get card_number () {return $('[name="cardnumber"]')}  // name="cardnumber" //4242424242424242
    get exp_date () {return $('[name="exp-date"]')}  //  name="exp-date" //1231
    get cvc () {return $('[name="cvc"]')}  //  name="cvc" //123
   
    


    get btn_place_order () {return $('button#place_order')}


  async review_cart () {
    var table = await $('table.shop_table');
        console.log("Review Cart validations, start ---");


        var table = await $('table.shop_table');
        await table.waitForDisplayed({ timeout: 3000 });
        table = await table.$('tfoot');
        // col mapping
        // Cost per unit #3
        // Quantity # 4
        // cost times quantity # 5
        // find all the rows
        var sub_total_all_rows=0;
        var rows=table.$$('tr');
        var total_rows= await rows.length;
        var ct_subtotal=0;
        var ct_flat_rate=0;
        var ct_tax = 0;
        var ct_total = 0;
        console.log("rows:",total_rows);
        // cart totals
        for (let i = 0; i < total_rows; i++) {
            var row=rows[i];
            var cols=await row.$$('td');
            console.log(i);
            /*
            i==0, subtotal
            i==1, flat rate
            i==2, tax
            i==3  total
            */
            var col=cols[0];
            //console.log("col:",col);
            var text_value=await col.getText();
            var regex = /[+-]?\d+(\.\d+)?/g;
            text_value.replace("$","");
            text_value=text_value.replace("$","");
            console.log("text_value",text_value);
            

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

    async fill_billing_info(billing_data){
        // pause for FF
        await browser.pause(500);
        // fill the billing info
        var fname=await this.billing_fname;
        await fname.click();
        await fname.clearValue();
        await fname.setValue(billing_data['fname']);
        
        //get billing_fname () {return $('#billing_first_name')}
        var last_name=await this.billing_lname;
        await last_name.clearValue();
        
        await last_name.setValue(billing_data['lname']);
        

        var billing_country = await this.billing_bc;
        await $('#select2-billing_country-container').click();
        var billing_country_values=await $('#select2-billing_country-results');
        await billing_country_values.waitForDisplayed({ timeout: 3000 });
        billing_country_values.selectByVisibleText(billing_data['country']);
        browser.keys("\uE007"); 

        var ba1=await this.billing_ba1;
        await  ba1.click();
        (await this.billing_ba1).setValue(billing_data['line1']);

        (await this.billing_bcity).setValue(billing_data['city']);
        browser.keys("\uE007"); 

        var browser_name=await browser.capabilities['browserName'];

        console.log(`Browser: ${browser_name} type of ${typeof(browser_name)}`);
       
        if (browser_name.includes('chrome'))
        {
        console.log("Chrome processing...");
        await $('#select2-billing_state-container').click();
        //await $('span.select2-selection__arrow').click(); // fix for FF

        var input_state_text=await $('input.select2-search__field');
        await input_state_text.click();
        await input_state_text.setValue(billing_data['state']);
        browser.keys("\uE007"); 
        }
        else
        {
            console.log("FF processing...");
            var billing_state_field= await $('p#billing_state_field');
            await billing_state_field.waitForClickable({ timeout: 30000 });
            await billing_state_field.click();

            var input_state_text=await $('input.select2-search__field');
            await input_state_text.click();
            await input_state_text.setValue(billing_data['state']);
            browser.keys("\uE007"); 


        }
        
        
        (await this.billing_post).setValue(billing_data['post']);

        (await this.billing_phone).setValue(billing_data['phone']);

        (await this.billing_email).setValue(billing_data['email']);

        (await this.billing_comment).setValue(billing_data['message']);

        var cc_iframe=await $('iframe[title="Secure card number input frame"]');
        //console.log("cc_iframe",cc_iframe);
        expect(cc_iframe).toExist();
        browser.switchToFrame(cc_iframe);
        browser.pause(400); // fix that card # is not overlapped

        var card_number=await this.card_number;
        // // getHTML
        //console.log("card number",await card_number.getHTML());
        await card_number.click();
        await card_number.setValue(billing_data['cc']);
         // switch back to parent frame
        await browser.switchToParentFrame();
        
        var cc_iframe=await $('iframe[title="Secure expiration date input frame"]');
        //console.log("cc_iframe",cc_iframe);
        expect(cc_iframe).toExist();
        browser.switchToFrame(cc_iframe);
        var exp_date=await this.exp_date;
        //console.log("cvc",await exp_date.getHTML());
        await exp_date.click();
        await exp_date.setValue(billing_data['exp']);
        await browser.switchToParentFrame();

        var cc_iframe=await $('iframe[title="Secure CVC input frame"]');
        //console.log("cc_iframe",cc_iframe);
        expect(cc_iframe).toExist();
        browser.switchToFrame(cc_iframe);
        var cvc_code= await this.cvc;
        //(await CheckOut.cvc).setValue('123');
        await cvc_code.setValue(billing_data['cvc']);
        await browser.switchToParentFrame();

    }
}

module.exports = new CheckOUt();