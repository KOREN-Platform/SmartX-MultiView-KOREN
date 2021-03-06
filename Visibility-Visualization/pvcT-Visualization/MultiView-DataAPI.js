var MongoClient = require('mongodb').MongoClient;
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var dateFormat  = require('dateformat');
var mongodbHost = '127.0.0.1';
var mongodbPort = '27017';
var mongodbDatabase = 'korenplatformdb';

ResourceProvider = function() {};
//UserProvider = function() {};

//Get MultiView Users
ResourceProvider.prototype.getUsers = function(callback)
{
    MongoClient.connect('mongodb://'+mongodbHost+':'+mongodbPort+'/'+mongodbDatabase, function(err, db)
    {
        var collection = db.collection("configuration-multiview-users");
        collection.find().toArray(function(err, users){
			callback(null,users);
			db.close();
		});
    });
};

//Get pBoxes List From MongoDB
ResourceProvider.prototype.getpBoxList = function(box_type, callback) 
{
	 //var boxes = {};//sboxes, cboxes, oboxes;
    MongoClient.connect('mongodb://'+mongodbHost+':'+mongodbPort+'/'+mongodbDatabase, function(err, db)
    {
        //console.log('Physical Boxes List: ');
		  // Locate all the entries using find
        var collection = db.collection("configuration-pbox-list");
        //collection.find({type: 'B**'},{box: true, host: true, management_ip: true, management_ip_status: true, data_ip: true, data_ip_status: true, control_ip: true, control_ip_status: true, _id: false}).sort({host: -1}).toArray(function(err, boxes){
		  //collection.find({$or:[{boxType: 'S'},{boxType: 'C'},{boxType: 'O'}]},{boxID: true, boxName: true, management_ip: true, boxType: true, management_ip: true, management_ip_status: true, data1_ip: true, data1_ip_status: true, control_ip: true, control_ip_status: true, _id: false}).sort({boxName: -1}).toArray(function(err, boxes){
		  collection.find({boxType: box_type},{boxID: true, boxName: true, boxType: true, site: true, management_ip: true, management_ip_status: true, data1_ip: true, data1_ip_status: true, control_ip: true, control_ip_status: true, _id: false}).sort({boxName: 1}).toArray(function(err, boxes){
	     	  callback(null, boxes);
		     db.close();
		});
	 });
};

//Get Controllers List From MongoDB
ResourceProvider.prototype.getControllerList = function(callback) 
{
	 MongoClient.connect('mongodb://'+mongodbHost+':'+mongodbPort+'/'+mongodbDatabase, function(err, db)
    {
        var collection = db.collection("configuration-controller-list");
        collection.find({},{controllerIP: true, controllerName: true, controllerStatus: true, controllerSoftware: true, _id: false}).sort({controllerName: -1}).toArray(function(err, controllers){
	     	  callback(null, controllers);
		     db.close();
		});
	 });
};

//Get vSwitches List From MongoDB
ResourceProvider.prototype.getvSwitchList = function(switch_type, callback)
{
    MongoClient.connect('mongodb://'+mongodbHost+':'+mongodbPort+'/'+mongodbDatabase, function(err, db)
    {
        console.log('OVS bridges List: ');
        var collection = db.collection("configuration-vswitch-list");
        collection.find({boxType: switch_type},{boxType: true, bridge: true, topologyorder: true, _id: false}).sort({topologyorder: 1}).toArray(function(err, switchList){
                //db.close();
                callback(null, switchList);
				db.close();
        });
    });
};

//Get vSwitches Status List From MongoDB
ResourceProvider.prototype.getovsBridgeStatus = function(box_type, callback)
{
    MongoClient.connect('mongodb://'+mongodbHost+':'+mongodbPort+'/'+mongodbDatabase, function(err, db)
    {
        console.log('OVS Bridge Status: ');
        var collection = db.collection("configuration-vswitch-status");
        collection.find({boxType: box_type},{boxType: true, boxID: true, bridge: true, status: true, _id: false}).sort({boxID: -1}).toArray(function(err, ovsBridgeStatus){
                //db.close();
                callback(null,ovsBridgeStatus);
				db.close();
        });
    });
};

//Get OpenStack Instances List From MongoDB
ResourceProvider.prototype.getvBoxList = function(callback)
{
    MongoClient.connect('mongodb://'+mongodbHost+':'+mongodbPort+'/'+mongodbDatabase, function(err, db)
    {
        console.log('OpenStack instances List: ');
        var collection = db.collection("configuration-vbox-list");
        collection.find({},{boxID: true, name: true, osuserid: true, ostenantid: true, vlanid: true, state: true, _id: false}).sort({boxID: -1}).toArray(function(err, vBoxList){
                //db.close();
                callback(null, vBoxList);
				db.close();
        });
    });
};

//Get IoT Host List From MongoDB
ResourceProvider.prototype.getIoTHostList = function(callback)
{
    MongoClient.connect('mongodb://'+mongodbHost+':'+mongodbPort+'/'+mongodbDatabase, function(err, db)
    {
        console.log('IoT Host List: ');
        var collection = db.collection("configuration-IoTHost-list");
        collection.find({},{boxID: true, hostID: true, macaddress: true, ipaddress: true, vlanid: true, _id: false}).sort({boxID: -1}).toArray(function(err, iotHostList){
                //db.close();
                callback(null, iotHostList);
				db.close();
        });
    });
};

//Get OpenStack Instances List for Specific Tenant From MongoDB
ResourceProvider.prototype.getTenantvBoxList = function(tenantID, callback)
{
    MongoClient.connect('mongodb://'+mongodbHost+':'+mongodbPort+'/'+mongodbDatabase, function(err, db)
    {
        console.log('OpenStack instances List in Tenant : '+tenantID);
        var collection = db.collection("configuration-vbox-list");
        collection.find({ostenantid: tenantID},{_id: false, state: false, osuserid: false, vlandid: false}).sort({box: -1}).toArray(function(err, vBoxList){
            //db.close();
            console.log(vBoxList);
            callback(null,vBoxList);
                        db.close();
        });
    });
};

//Get Workloads List From MongoDB
ResourceProvider.prototype.getServicesList = function(callback)
{
    MongoClient.connect('mongodb://'+mongodbHost+':'+mongodbPort+'/'+mongodbDatabase, function(err, db)
    {
        console.log('Services List: ');
        var collection = db.collection("configuration-service-list");
        collection.find({type: 'B**'},{box: true, name: true, osusername: true, ostenantname: true, vlanid: true, state: true, _id: false}).sort({box: -1}).toArray(function(err, vmList){
                //db.close();
                callback(null,vmList);
				db.close();
        });
    });
};

//Get Tenant-vlan Mapping List
ResourceProvider.prototype.gettenantvlanmapList = function(callback)
{
    MongoClient.connect('mongodb://'+mongodbHost+':'+mongodbPort+'/'+mongodbDatabase, function(err, db)
    {
		//console.log('Tenant-vlan Mapping List: '+tenantID);
		var collection = db.collection("configuration-tenant-vlan-mapping");
		collection.find({},{_id: false}).sort({name: -1}).toArray(function(err, tenantList){
			callback(null,tenantList);
			db.close();
		});
    });
};

//Get Bridge-vlan Mapping List
ResourceProvider.prototype.getbridgevlanmapList = function(vlanID, callback)
{
    MongoClient.connect('mongodb://'+mongodbHost+':'+mongodbPort+'/'+mongodbDatabase, function(err, db)
    {
		console.log('Bridge-vlan Mapping for '+vlanID);
		var collection = db.collection("configuration-bridge-vlan-map-rt");
		collection.find({vlan: vlanID},{_id: false, timestamp:false}).sort({vlan: -1}).toArray(function(err, vlanList){
			callback(null, vlanList);
			db.close();
		});
    });
};

//Get Operator Controller Flow Rules
ResourceProvider.prototype.getOpsSDNConfigList = function(boxID, callback)
{
    MongoClient.connect('mongodb://'+mongodbHost+':'+mongodbPort+'/'+mongodbDatabase, function(err, db)
    {
	console.log('Flow Rules List: '+boxID);
	var currentTime = new Date();
	console.log('System Time: '+currentTime);
	dateFormat(currentTime.setMinutes(currentTime.getMinutes() - 59));
	console.log('Updated Time: '+currentTime);
       	var collection = db.collection("flow-configuration-sdn-controller-rt");
        collection.find({controllerIP: '103.22.221.152', boxID: boxID},{_id: false}).sort({name: -1}).toArray(function(err, rulesList){
                callback(null,rulesList);
				db.close();
        });
    });
};

//Get Operator Controller Flow Statistics
ResourceProvider.prototype.getOpsSDNStatList = function(boxID, callback)
{
    MongoClient.connect('mongodb://'+mongodbHost+':'+mongodbPort+'/'+mongodbDatabase, function(err, db)
    {
        console.log('Flow Statistics List: ');
        var currentTime = new Date();
        console.log('System Time: '+currentTime);
        dateFormat(currentTime.setMinutes(currentTime.getMinutes() - 5));
        console.log('Updated Time: '+currentTime);
        var collection = db.collection("flow-stats-sdn-controller-rt");
        collection.find({controllerIP: '103.22.221.152', boxID: boxID},{_id: false}).sort({name: -1}).toArray(function(err, statList){
            callback(null,statList);
			db.close();
        });
    });
};

exports.ResourceProvider = ResourceProvider;
//exports.UserProvider = UserProvider;
