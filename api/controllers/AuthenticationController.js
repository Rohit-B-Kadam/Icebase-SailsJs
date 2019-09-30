/**
 * AuthenticationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  //Controller action for 'GET /helloworld'
  printHelloWorld : function(req,res){
    return res.json({ "status": 0, "message": "HelloWorld"});
  },

  // Create
  signUp: function(req,res){
    
    try {
      var parameters = req.body;
      console.log("parameters:" + JSON.stringify(parameters))
      
      // Find if user already exist or Create new user
      Authentication.findOrCreate({ Email: parameters.email},//find 
        { //create
          FirstName: parameters.firstName, 
          LastName: parameters.lastName, 
          Email: parameters.email, 
          Password: parameters.password
        })
        .exec(
          // after operation below function will call
          function(err,user,wasCreated)
          {
            console.log("user:"+JSON.stringify(user)+" wasCreated:"+wasCreated)
             if(err){
                 return res.json({ "status": -1, "error": "There was an error while registering the user. \n" + err });
             }else if(wasCreated){
                 return res.json({ "status": 0, "message": "User registered successfully"});
             }else{
                 return res.json({ "status": -1, "error": "Username already exists"});
             }   
        })

    } catch (err) {
      return res.json({ "status": -1, "ErrorMessage": err });
    }
  },

  // Read
  signIn: function(req,res)
  {
    try {
      var parameters = req.body;
      console.log("parameters:" + JSON.stringify(parameters))
      
      // Find if user already exist
      Authentication.find({ Email: parameters.email , Password: parameters.password })
        .exec(function(err,users)
        {
            if(err){
                return res.json({ "status" : -1, "error": ""+err });
            }
            else if(users.length == 0)
            {
              return res.json({ "status": -1, "error": "User Not Found"})
            }
            else if(users){
                return res.json({ "status": 0, "users": users})
            }
            
        })

    } catch (err) {
      return res.json({ "status": -1, "ErrorMessage": err });
    }
  },

  // Update
  update : function(req, res)
  {
    try {

      var parameters = req.body;
      console.log("Update parameters:" + JSON.stringify(parameters))
      
      //Query
      Authentication.update({ id: parameters.id })
      .set({ 
        FirstName: parameters.firstName, 
        LastName: parameters.lastName, 
        Email: parameters.email, 
        Password: parameters.password
      })
      .fetch()
      .exec(function(err, user) {
          console.log("USER:" + JSON.stringify(user))
          if (err) {
              return res.json({ "status": -1, "error": "There was an error while updating. \n" + err });
          } else if (user && user.length == 1) {
              return res.json({ "status": 0, "message": "Profile changed successfully" });
          }
          // else if (!user || user.length == 0) {
          //     return res.json({ "status": -1, "error": "Please check your email" });
          // }
      })

    } catch (err) {
      return res.json({ "status": -1, "ErrorMessage": err });
    } 
  },

  delete: function(req,res)
  {
    try {
      var parameters = req.body;
      console.log("Update parameters:" + JSON.stringify(parameters))
      
      //Query
      Authentication.destroy({ id: parameters.id})
      .fetch()
      .exec(function(err, user) {
          console.log("Deleted User: " + JSON.stringify(user))
          if (err) {
              return res.json({ "status": -1, "error": "There was an error while deleting the user. \n" + err });
          } else if (user && user.length == 1) {
              return res.json({ "status": 0, "message": "User " + user[0].FirstName + " deleted." });
          } else if (!user || user.length == 0) {
              return res.json({ "status": -1, "error": "There was an error while deleting the user." });
          }
      })

    } catch (err) {
      return res.json({ "status": -1, "ErrorMessage": err });
    } 
  }


};

