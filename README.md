Check the dependencies: node and npm is installed in the system
node -v # version on system is: v14.16.1
npm -v # version on system is : 7.10.0

Steps:
1.  Create a folder/directory and cd to that directory
    $mkdir webdriverIO && cd webdriverIO
2.  Install WebdriverIO CLI tool
    npm install @wdio/cli
3.  create the empty NPM project and y means, take the default and no questions
    npm init -y
4.  create a project: 
    $npx wdio config

## Run the test!
1. run all spec files: 
    npx wdio    
2. run particular spec file
    npx wdio --spec ./test/specs/shop2.e2e.js


## Notes
To run a particular spec.js:
npx wdio --spec ./test/specs/digialert_sub.e2e.js

# install allure command line:
npm install -g allure-commandline --save-dev
or
sudo npm install -g allure-commandline 

# to produce the report: 
allure generate allure-results  && allure open 
allure generate allure-results --clean && allure open 


## VS Code
In VS code, for mocha boiler plate, install “ES6 Mocha Snippets” extension.

add a video to report?
1 . install the dependency :
    npm install wdio-video-reporter    
modify wdio.conf.js:

```java script
reporters: [    
        [video, {
        saveAllVideos: false,       // If true, also saves videos for successful test cases, false
        videoSlowdownMultiplier: 3, // Higher to get slower videos, lower for faster videos [Value 1-100]
      }],
        'spec',
    ['allure', {outputDir: 'allure-results'}]],
```

Test case:
## E2E test case for checkout(adding product,cart validation and checkout)
Cart validation:
few key concepts covered for Webdriver.io
1. read a table, and perform expecpt at cart level(so test can be pipeline or regression)
2. read data, config_data for products and check_out_data for filling billing data.
3. Page object model. Selecetors and key validation on page been kept in POM. For example, in cart POM, it also contains validation for cart i.e.
    price times quantity equals subtotal ( and do this for each row/product, and also get the sum of all subtotals)
    then Sum(subtotal) + shipping(get amount using regex) + tax equals Total. This total equals amount charged in checkout. 






