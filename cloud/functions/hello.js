Parse.Cloud.define('hello', function(req, res) {
  res.success('world');
});

Parse.Cloud.define('createBizAccount',function(req,res){
  const stripe = require('stripe')('sk_test_CqDHZlR0lvt66Jo9gKFundJ4');
  var bizEmail = req.params.email;
  stripe.accounts.create({
    type: 'custom',
    country: 'US',
    email: bizEmail
  }, function (err, account) {
     console.log(err);
     console.log(account); 
     if(err != null){
      res.success(account);
     }else{
       res.error(err);
     }
    
  });
});