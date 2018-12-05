Parse.Cloud.define('hello', function(req, res) {
  res.success('world');
});

Parse.Cloud.define('createBizAccount',function(req,res){
  const stripe = require('stripe')('sk_test_CqDHZlR0lvt66Jo9gKFundJ4');
  stripe.accounts.create({
    type: 'custom',
    country: 'US',
    email: 'bob@example.com'
  }, function (err, account) {
     console.log(err);
     console.log(account);     
     res.success(account);
  });
});