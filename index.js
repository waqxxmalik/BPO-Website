const express = require('express')
const app = express()
var nodemailer = require('nodemailer');
const bodyParser = require('body-parser'); 
const fs = require('fs')
const multer = require('multer')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use(bodyParser.json())
app.set("view engine", "ejs")
app.use(express.static(__dirname + "public"));
//require mome //seed the database



	

var Storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "./images");
    },
    filename: function(req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

var upload = multer({
    storage: Storage
}).single("image"); //Field name and max count

app.get("/", function(req, res){
	res.render("pages/Index")
})

app.get('/sendemail', (req,res) => {
    res.render("pages/result")
})


app.post('/sendemail',(req,res) => {
    upload(req,res,function(err){
        if(err){
            console.log(err)
            return res.end("Something went wrong!");
        }else{
			path = req.file.path;
			const output = `
        <p>You have a new contact request</p>
        <h3>Contact Details</h3>
       <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Phone: ${req.body.phone}</li>
      <li>secondary-contact : ${req.body.secondary}</li>
      <li>emergency number: ${req.body.emergency}</li>
      <li>Email: ${req.body.email}</li>
      <li>Address: ${req.body.address}</li>
      <li>Adress2: ${req.body.address2}</li>
      <li>Other address: ${req.body.address3}</li>
      <li>City: ${req.body.city}</li>
      <li>Province: ${req.body.province}</li>
      <li>Skype: ${req.body.skype}</li>
      <hr>     
      <li>dob: ${req.body.dob}</li>
           <li>CNIC: ${req.body.cnic}</li>
     <li>Gender: ${req.body.gender}</li>
        <li>Martial Status: ${req.body.martial}</li>
     <li>Where did you find Us: ${req.body.find}</li>
           <li>Work: ${req.body.work}</li>
     <li>Schedule: ${req.body.schedule}</li>
      <li>Location: ${req.body.location}</li>
     <li>Experience: ${req.body.exp}</li>
     <li>Previous Organization: ${req.body.text}</li>
     <li>Speedtest: ${req.body.speed}</li>
</ul>`;
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'muhammadwaqasarif1001@gmail.com',
                  pass: 'atiupsermdmnoupr'
                }
              });
              
              var mailOptions = {
                from: req.body.email,
                to: "muhammadwaqasarif1001@gmail.com" ,
                attachments: [
                  {
                   path: path
                  }
               ],
			  html: output	  
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
				  console.log('Email sent: ' + info.response);
                req.flash('error', 'Succesfully Sent');
                
					fs.unlink(path,function(err){
                    if(err){
                        return res.end(err)
                    }else{
                        console.log("deleted")
                        return res.redirect('/')
                    }
                  })
                }
              });
        }
    })
})

app.get('/about', function(req, res){
	res.render('pages/about')
})


app.get("/clients",   function(req, res){
	Client.find({}, function(err, allclients){
		if(err){
			console.log(err);
		} else {
	res.render("pages/client",  {clients: allclients})
		}
	})
})

app.post("/clients",  function(req, res){
	
    // Create a new campground and save to DB
    Client.create(req.body.client, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
           res.redirect("/clients")
		}
    });
  });
app.get("/newclients", function(req, res){
	res.render("pages/newclient")
})
app.get("/clients/:id", function(req, res){
    //find the campground with provided ID
    Client.findById(req.params.id, function(err, foundclient){
        if(err || !foundclient){
            console.log(err);
            req.flash('error', 'Sorry, that client does not exist!');
            return res.redirect('/clients');
        }
        console.log(foundclient)
        //render show template with that campground
        res.render("pages/show", {client: foundclient});
    });
});


app.delete("/clients/:id",  function(req, res) {
Client.findByIdAndRemove(req.params.id, function(err){
	if(err) {
        req.flash('error', err.message);
		return res.redirect('/');
        } else {
        req.flash('error', 'Client deleted!');
	   res.redirect('/clients');
      } 
})
});


app.get("/contact", function(req , res){
	res.render("pages/contact")
})




app.listen(process.env.PORT || 5000, () => {
  console.log(`getting started`);
});
