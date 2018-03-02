var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var md5 = require('md5');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'techninzaz_locator'
});

connection.connect();

router.post('/addinstitute', function(req,res){
	//console.log("you are here");
	var chkQry = "SELECT * FROM institute_registration WHERE ??=? OR ??=? OR ??=?";
	var cheQryData = ['inst_name',req.body.i_name,'inst_contact',req.body.i_contact,'inst_email',req.body.i_email];
	chkQry = mysql.format(chkQry,cheQryData);
	//console.log(chkQry);
	connection.query(chkQry,function(errr,results){
		if(results.length<1){
			var query = 'INSERT into institute_registration (??,??,??,??,??,??,??,??) values (?,?,?,?,?,?,?,?)';
			var data = ['inst_name','inst_address','inst_city','inst_contact','inst_altcontact','inst_email','inst_password','inst_images',req.body.i_name,req.body.i_address,req.body.i_city,req.body.i_contact,req.body.i_altcontact,req.body.i_email,md5(req.body.i_password),req.body.i_images];
			query = mysql.format(query,data);
			console.log(query);
			connection.query(query,function(err,result){
				//console.log(result);
				var x = {};
				x.user_id = result.insertId;
				res.json({status: true, message: 'Institute Added Successfully',result: x});	

			});
		}else{
			res.json({status: false,message: 'Institute Already Exist',result: results[0]});
		}
	});
});

/*router.post('/addinstitute', function(req,res){
	var chkQry = "SELECT * FROM institute_registration WHERE ??=? OR ??=? OR ??=?";
	var cheQryData = ['inst_name',req.body.i_name,'inst_contact',req.body.i_contact,'inst_altcontact',req.body.i_altcontact,'inst_email',req.body.i_email];
	chkQry = mysql.format(chkQry,cheQryData);
	console.log(chkQry);
	connection.query(chkQry,function(errr,results){
		if(results.length<1){
			var query = 'INSERT into institute_registration (??,??,??,??,??,??,??) values (?,?,?,?,?,?,?)';
			var data = ['inst_name','inst_address','inst_city','inst_contact','inst_altcontact','inst_email','inst_images',req.body.i_name,req.body.i_address,req.body.i_city,req.body.i_contact,req.body.i_altcontact,req.body.i_email,req.body.i_images];
			query = mysql.format(query,data);
			//console.log(query);
			connection.query(query,function(err,result){
				//console.log(result);
				var x = {};
				x.user_id = result.insertId;
				res.json({status: true, message: 'Institute Added Successfully',result: x});	

			});
		}else{
			res.json({status: false,message: 'Institute Already Exist',result: results[0]});
		}
	});
});*/
 
router.post('/updatelc', function(req,res){
	var chkQry = "SELECT * FROM institute_registration WHERE ??=?";
	var cheQryData = ['id',req.body.i_id];
	chkQry = mysql.format(chkQry,cheQryData);
	console.log(chkQry);
	connection.query(chkQry,function(errr,results){
		if(results.length==1 && (req.body.i_type=='location' || req.body.i_type=='course')){
			var query = 'update institute_registration set ??=? where ??=?';
			if(req.body.i_type=='location'){
				var data = ['inst_prefer_locations',req.body.i_lc,'id',req.body.i_id];	
			}else{
				var data = ['inst_off_courses',req.body.i_lc,'id',req.body.i_id];	
			}

			query = mysql.format(query,data);
			//console.log(query);
			connection.query(query,function(err,result){
				//console.log(result);
				var x = {};
				x.user_id = req.body.i_id;
				res.json({status: true, message: 'Institute Updated Successfully',result: x});	 

			});
		}else{
			res.json({status: false,message: 'Institute Not Exist',result: results[0]});
		}
	});
}); 

router.get('/searchstudents/:cid/:lid', function(req,res){
	var searchQry = 'SELECT * from user_enquiry where ??=? AND ?? = ?';
	var searchQryData = ['course_id',req.params.cid, 'location_id', req.params.lid];
	searchQry = mysql.format(searchQry,searchQryData);
	connection.query(searchQry,function(err,results){
		//console.log(results);
		if(results.length>=1){
			/*var queryLC= 'SELECT * from institute_registration where find_in_set(?,??) <> 0 and find_in_set(?,??) <> 0';
			var queryLCData = [results[0].course_id,'inst_off_courses',results[0].location_id,'inst_prefer_locations'];
			queryLC = mysql.format(queryLC,queryLCData);

			console.log(queryLC);

			connection.query(queryLC,function(e,r){
					res.json({status: true, response:r});	 
			});*/
			var query1 = "SELECT et.enq_id, ue.user_id, ur.user_first_name, ur.user_last_name, ur.user_mobile_number, ur.user_altmobile_number, ur.user_email, ur.user_type, ue.course_id, ue.location_id FROM user_enquiry ue, enquiry_trans et, user_registration ur WHERE ?? = ?? AND ?? = ? AND ?? = ? AND ?? = ? AND ?? = ??";
			var query1Data = ["ue.id", "et.enq_id", "ue.course_id", req.params.cid, "ue.location_id", req.params.lid, "et.inst_id", 11, "ue.user_id", "ur.user_id"];
			query1 = mysql.format(query1, query1Data);
			//console.log(query1);
			connection.query(query1, function(e, r){
				if(e) {
					res.json({status: false, response: e});
				} else {
					/*r.forEach(function(i,k){
						var queryCourse = "SELECT * FROM offered_locations WHERE ?? = ?";
						var queryCourseData = ['id', i.course_id];
						queryCourse = mysql.format(queryCourseData);
						connection.query(queryCourse, function(eC, rC){
							console.log('-----------');
							console.log(rC);
							//r[i].CourseInfoDetail = rC;
							//console.log(r[i]);
						});
					});*/
					res.json({status: true, response: r});
				}
			});
		}else{
			res.json({status:false, response: "No Matching Found"});
		}
	});

});

router.post('/loginInstitute', function(req,res){
	//console.log("you are here");
	var chkQry = "SELECT * FROM institute_registration WHERE ??=? OR ??=? AND ??=?";
	var cheQryData = ['inst_contact',req.body.i_loginparams,'inst_email',req.body.i_loginparams,'inst_password',md5(req.body.i_password)];
	chkQry = mysql.format(chkQry,cheQryData);
	//console.log(chkQry);
	connection.query(chkQry,function(errr,results){
		//console.log(results);
		if(results.length>1){
			res.json({status: false, message: 'Institute Details exist more than one'});	
		}else{
			/*delete(results[0].inst_off_courses);
			delete(results[0].inst_prefer_locations);
			delete(results[0].inst_password);*/
			res.json({status: true,message: 'Institute Login Successful',result: results[0]});
		}
	});
});



module.exports = router;
