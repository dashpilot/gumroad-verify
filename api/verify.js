const axios = require('axios');

module.exports = async (req, res) =>{
    try{
    
        if(!req.body.license) return res.status(400).send('No license found.'); //checks that license prop exists
        
        //send verification request to gumroad
        const response  = await axios({
                                method: 'post',
                                url: 'https://api.gumroad.com/v2/licenses/verify',
                                data: {
                                product_permalink: process.env.PRODUCT_PERMALINK,
                                license_key: req.body.license //can change this according to what the payload will look like
                                },
                                validateStatus: function (status) {
                                    return status < 500; // Reject only if the status code is greater than or equal to 500
                                  }
                            });
        
        if(response.data.success){
            //Check if refunded or chargedback            
            if(!response.data.purchase.refunded && !response.data.purchase.chargebacked){
             return  res.status(200).json({isValid: true})
            }
        }
        return res.status(200).json({isValid: false});
        
    }catch(err){
        console.log(err);
        return res.status(500).json({errorMessage: 'Something went wrong'});
    }
}
