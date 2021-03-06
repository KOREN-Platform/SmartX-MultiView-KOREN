/**
 * Module dependencies.
 */

var express = require('express');
var async = require('async');
var BoxProvider = require('./MultiView-DataAPI').BoxProvider;
var http = require("http");
var app = express();
var client = require('socket.io').listen(8090).sockets;
var host = "103.22.221.56";

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.json());
  app.use(express.urlencoded());
  
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
});
app.configure('production', function(){
  app.use(express.errorHandler()); 
});

//Define Application Routes
var resourceProvider = new ResourceProvider();
// Route for Resource-Centric View
app.get('/resourcecentricviewops', function(req, res){
    var sboxList         = null;
    var cboxList         = null;
    var oboxList         = null;
    var switchList      = null;
    var instanceList    = null;
    var workloadList    = 0;
    var ovsBridgeStatus = null;
    var boxes           = {};
    var pPathStatus     = null;
    
    var tasks = [
    function(callback){
    	resourceProvider.getpBoxList('S', (function(error, sboxobj)
    	{
		 	boxes.sbox = sboxobj;
	    	//console.log(boxes.sbox);
	    	callback();
		 	//showView();
    	}))
    },
    
    function (callback){
    	resourceProvider.getpBoxList('C', (function(error, cboxobj)
    {
		 boxes.cbox = cboxobj;
	    //console.log(boxes.cbox);
	    callback();
		 //showView();
    }))
    },
    function (callback){
    	resourceProvider.getpBoxList('O', (function(error, oboxobj)
    	{
		 	boxes.obox = oboxobj;
	    	console.log(boxes.obox);
	    	callback();
		 	//showView();
    	}))
    },
    function (callback){
    	resourceProvider.getvSwitchList('S', (function(error, sswitchobj)
    	{
    		boxes.sswitchList = sswitchobj;
       	//console.log(switchList);
       	callback();
		 	//showView();
    	}))
    },
    function (callback){
    	resourceProvider.getvSwitchList('C', (function(error, cswitchobj)
    	{
    		boxes.cswitchList = cswitchobj;
       	//console.log(switchList);
       	callback();
		 	//showView();
    	}))
    },
    function (callback){
    	resourceProvider.getvSwitchList('O', (function(error, oswitchobj)
    	{
    		boxes.oswitchList = oswitchobj;
       	//console.log(boxes.oswitchList);
       	callback();
		 	//showView();
    	}))
    },
    function (callback){
    	resourceProvider.getovsBridgeStatus('S', function(error, sbridgestatusobj)
    	{
        boxes.sovsBridgeStatus = sbridgestatusobj;
        //console.log(ovsBridgeStatus);
        callback();
        //showView();
    	})
    },
    function (callback){
    	resourceProvider.getovsBridgeStatus('C', function(error, cbridgestatusobj)
    	{
        boxes.covsBridgeStatus = cbridgestatusobj;
        //console.log(boxes.covsBridgeStatus);
        callback();
        //showView();
    	})
    },
    function (callback){
    	resourceProvider.getovsBridgeStatus('O', function(error, obridgestatusobj)
    	{
        boxes.oovsBridgeStatus = obridgestatusobj;
        //console.log(boxes.oovsBridgeStatus);
        callback();
        //showView();
    	})
    },
    function(callback){
    	resourceProvider.getvBoxList(function(error, instanceobj)
    	{
        boxes.instanceList = instanceobj;
        //console.log(boxes.instanceList);
        callback();
        //showView();
    	})
    },
    function(callback){
    	resourceProvider.getIoTHostList(function(error, hostobj)
    	{
        boxes.iotHostList = hostobj;
        //console.log(boxes.iotHostList);
        callback();
      })
    },
    function(callback){
    	resourceProvider.getControllerList(function(error, controllerobj)
    	{
        boxes.controllerList = controllerobj;
        console.log(boxes.controllerList);
        callback();
      })
    }
    ];

	 async.parallel(tasks, function(err) { 
		   console.log('Resource-Centric View Rendering');
//		   console.log(boxes.sbox);
			res.render('resourcecentricviewops.jade', {
         sboxList         : JSON.stringify(boxes.sbox),
         cboxList         : JSON.stringify(boxes.cbox),
         oboxList         : JSON.stringify(boxes.obox),
			sswitchList      : JSON.stringify(boxes.sswitchList),
			cswitchList      : JSON.stringify(boxes.cswitchList),
			oswitchList      : JSON.stringify(boxes.oswitchList),
			instanceList    : JSON.stringify(boxes.instanceList),
			iotHostList    : JSON.stringify(boxes.iotHostList),
//			workloadList     : JSON.stringify(workloadList),
			sovsBridgeStatus : JSON.stringify(boxes.sovsBridgeStatus),
			covsBridgeStatus : JSON.stringify(boxes.covsBridgeStatus),
			oovsBridgeStatus : JSON.stringify(boxes.oovsBridgeStatus),
			controllerList : JSON.stringify(boxes.controllerList)
        	});
        	}
    		);
    });

//Route for Flow Rules View
app.get('/flowrulesviewops', function(req, res){
    console.log('Flow Rules and Statistics View Rendering');
    //res.render('flowrulesviewops.jade', {title: 'Flow-Centric View'})
    var boxList         = null;
    var switchList      = null;
    var instanceList    = null;
    var workloadList     = 0;
    var ovsBridgeStatus = null;
    var pPathStatus     = null;
    resourceProvider.getpBoxList( function(error,boxobj)
    {
        boxList = boxobj;
        console.log( boxList);
        showView();
    })
    resourceProvider.getvSwitchList(function(error, switchobj)
    {
        switchList = switchobj;
        console.log(switchList);
        showView();
    })

    resourceProvider.getvBoxList(function(error, instanceobj)
    {
        instanceList = instanceobj;
        console.log(instanceList);
        showView();
    })

	resourceProvider.getovsBridgeStatus(function(error, bridgestatusobj)
    {
        ovsBridgeStatus = bridgestatusobj;
        console.log(ovsBridgeStatus);
        showView();
    })

    function showView()
    {
        if(boxList !== null && switchList !== null && instanceList !== null && workloadList !==null &&  ovsBridgeStatus !== null)
        {
                console.log('Flow Rules and Statistics View Rendering');
                res.render('flowrulesviewops.jade',{locals: {
                        boxList         : JSON.stringify(boxList),
                        switchList      : JSON.stringify(switchList),
                        instanceList    : JSON.stringify(instanceList),
                        workloadList     : JSON.stringify(workloadList),
//                      pPathStatus    : JSON.stringify(pPathStatus),
                        ovsBridgeStatus : JSON.stringify(ovsBridgeStatus)
                },
                title: 'Flow Rules and Statistics View Rendering'}
                )
        }
    }
});

// Route for Flow Path Tracing View
app.get('/flowtracingviewops/*', function(req, res){
	//Wait for 1 minute before requesting again
	req.connection.setTimeout(60*1000);
	
	console.log('Flow Path Tracing View Rendering');
    
	var tenantID=req.originalUrl;
	var vlanID=tenantID;
	
	tenantID=tenantID.substring(20, tenantID.indexOf("&"));
	vlanID=vlanID.substring(vlanID.indexOf("&")+1, vlanID.length);
	console.log(tenantID);
	console.log(vlanID);
	
    var boxList           = null;
    var switchList        = null;
    var instanceList      = null;
    var workloadList      = 0;
    var ovsBridgeStatus   = 0;
	var bridgevlanmapList = null;
    
	resourceProvider.getpBoxList( function(error,boxobj)
    {
        boxList = boxobj;
        showView();
    })
    resourceProvider.getvSwitchList(function(error, switchobj)
    {
        switchList = switchobj;
        showView();
    })

    resourceProvider.getTenantvBoxList(tenantID, function(error, instanceobj)
    {
        instanceList = instanceobj;
        showView();
    })

	resourceProvider.getbridgevlanmapList(vlanID, function(error, bridgevlanmapobj)
    {
       	bridgevlanmapList = bridgevlanmapobj;
       	showView();
    })

    function showView()
    {
        if(boxList !== null && switchList !== null && instanceList !== null && workloadList !==null &&  ovsBridgeStatus !== null && bridgevlanmapList !==null)
        {
                res.render('flowtracingviewops.jade',{locals: {
                        boxList           : JSON.stringify(boxList),
                        switchList        : JSON.stringify(switchList),
                        instanceList      : JSON.stringify(instanceList),
                        workloadList      : JSON.stringify(workloadList),
                        ovsBridgeStatus   : JSON.stringify(ovsBridgeStatus),
                        bridgevlanmapList : JSON.stringify(bridgevlanmapList)
                },
                title: 'Flow Tracing View Rendering'}
                )
        }
    }
});

// Route for Flows/Playground Measurements View
app.get('/flowmeasureviewops', function(req, res){
    console.log('Flow Measure View Rendering');
    var sboxList         = null;
    var cboxList         = null;
    var oboxList         = null;
    var switchList      = null;
    var instanceList    = null;
    var workloadList    = 0;
    var ovsBridgeStatus = null;
    var boxes           = {};
    var pPathStatus     = null;
    
    var tasks = [
    function(callback){
    	resourceProvider.getpBoxList('S', (function(error, sboxobj)
    	{
		 	boxes.sbox = sboxobj;
	    	//console.log(boxes.sbox);
	    	callback();
		 	//showView();
    	}))
    },
    
    function (callback){
    	resourceProvider.getpBoxList('C', (function(error, cboxobj)
    {
		 boxes.cbox = cboxobj;
	    //console.log(boxes.cbox);
	    callback();
		 //showView();
    }))
    },
    function (callback){
    	resourceProvider.getpBoxList('O', (function(error, oboxobj)
    	{
		 	boxes.obox = oboxobj;
	    	console.log(boxes.obox);
	    	callback();
		 	//showView();
    	}))
    },
    function (callback){
    	resourceProvider.getvSwitchList('S', (function(error, sswitchobj)
    	{
    		boxes.sswitchList = sswitchobj;
       	//console.log(switchList);
       	callback();
		 	//showView();
    	}))
    },
    function (callback){
    	resourceProvider.getvSwitchList('C', (function(error, cswitchobj)
    	{
    		boxes.cswitchList = cswitchobj;
       	//console.log(switchList);
       	callback();
		 	//showView();
    	}))
    },
    function (callback){
    	resourceProvider.getvSwitchList('O', (function(error, oswitchobj)
    	{
    		boxes.oswitchList = oswitchobj;
       	//console.log(boxes.oswitchList);
       	callback();
		 	//showView();
    	}))
    },
    function (callback){
    	resourceProvider.getovsBridgeStatus('S', function(error, sbridgestatusobj)
    	{
        boxes.sovsBridgeStatus = sbridgestatusobj;
        //console.log(ovsBridgeStatus);
        callback();
        //showView();
    	})
    },
    function (callback){
    	resourceProvider.getovsBridgeStatus('C', function(error, cbridgestatusobj)
    	{
        boxes.covsBridgeStatus = cbridgestatusobj;
        //console.log(boxes.covsBridgeStatus);
        callback();
        //showView();
    	})
    },
    function (callback){
    	resourceProvider.getovsBridgeStatus('O', function(error, obridgestatusobj)
    	{
        boxes.oovsBridgeStatus = obridgestatusobj;
        //console.log(boxes.oovsBridgeStatus);
        callback();
        //showView();
    	})
    },
    function(callback){
    	resourceProvider.getvBoxList(function(error, instanceobj)
    	{
        boxes.instanceList = instanceobj;
        //console.log(boxes.instanceList);
        callback();
        //showView();
    	})
    },
    function(callback){
    	resourceProvider.getIoTHostList(function(error, hostobj)
    	{
        boxes.iotHostList = hostobj;
        //console.log(boxes.iotHostList);
        callback();
      })
    },
    function(callback){
    	resourceProvider.getControllerList(function(error, controllerobj)
    	{
        boxes.controllerList = controllerobj;
        console.log(boxes.controllerList);
        callback();
      })
    }
    ];

	 async.parallel(tasks, function(err) { 
		   console.log('Flow-Centric View Rendering');
//		   console.log(boxes.sbox);
			res.render('flowmeasureviewops.jade', {
         sboxList         : JSON.stringify(boxes.sbox),
         cboxList         : JSON.stringify(boxes.cbox),
         oboxList         : JSON.stringify(boxes.obox),
			sswitchList      : JSON.stringify(boxes.sswitchList),
			cswitchList      : JSON.stringify(boxes.cswitchList),
			oswitchList      : JSON.stringify(boxes.oswitchList),
			instanceList    : JSON.stringify(boxes.instanceList),
			iotHostList    : JSON.stringify(boxes.iotHostList),
//			workloadList     : JSON.stringify(workloadList),
			sovsBridgeStatus : JSON.stringify(boxes.sovsBridgeStatus),
			covsBridgeStatus : JSON.stringify(boxes.covsBridgeStatus),
			oovsBridgeStatus : JSON.stringify(boxes.oovsBridgeStatus),
			controllerList : JSON.stringify(boxes.controllerList)
        	});
        	}
    		);
});

// Route for Flows/Playground Measurements View
app.get('/flowiovisorviewops', function(req, res){
    console.log('Flow Measure View Rendering');
    var sboxList         = null;
    var cboxList         = null;
    var oboxList         = null;
    var switchList      = null;
    var instanceList    = null;
    var workloadList    = 0;
    var ovsBridgeStatus = null;
    var boxes           = {};
    var pPathStatus     = null;
    
    var tasks = [
    function(callback){
    	resourceProvider.getpBoxList('S', (function(error, sboxobj)
    	{
		 	boxes.sbox = sboxobj;
	    	//console.log(boxes.sbox);
	    	callback();
		 	//showView();
    	}))
    },
    
    function (callback){
    	resourceProvider.getpBoxList('C', (function(error, cboxobj)
    {
		 boxes.cbox = cboxobj;
	    //console.log(boxes.cbox);
	    callback();
		 //showView();
    }))
    },
    function (callback){
    	resourceProvider.getpBoxList('O', (function(error, oboxobj)
    	{
		 	boxes.obox = oboxobj;
	    	console.log(boxes.obox);
	    	callback();
		 	//showView();
    	}))
    },
    function (callback){
    	resourceProvider.getvSwitchList('S', (function(error, sswitchobj)
    	{
    		boxes.sswitchList = sswitchobj;
       	//console.log(switchList);
       	callback();
		 	//showView();
    	}))
    },
    function (callback){
    	resourceProvider.getvSwitchList('C', (function(error, cswitchobj)
    	{
    		boxes.cswitchList = cswitchobj;
       	//console.log(switchList);
       	callback();
		 	//showView();
    	}))
    },
    function (callback){
    	resourceProvider.getvSwitchList('O', (function(error, oswitchobj)
    	{
    		boxes.oswitchList = oswitchobj;
       	//console.log(boxes.oswitchList);
       	callback();
		 	//showView();
    	}))
    },
    function (callback){
    	resourceProvider.getovsBridgeStatus('S', function(error, sbridgestatusobj)
    	{
        boxes.sovsBridgeStatus = sbridgestatusobj;
        //console.log(ovsBridgeStatus);
        callback();
        //showView();
    	})
    },
    function (callback){
    	resourceProvider.getovsBridgeStatus('C', function(error, cbridgestatusobj)
    	{
        boxes.covsBridgeStatus = cbridgestatusobj;
        //console.log(boxes.covsBridgeStatus);
        callback();
        //showView();
    	})
    },
    function (callback){
    	resourceProvider.getovsBridgeStatus('O', function(error, obridgestatusobj)
    	{
        boxes.oovsBridgeStatus = obridgestatusobj;
        //console.log(boxes.oovsBridgeStatus);
        callback();
        //showView();
    	})
    },
    function(callback){
    	resourceProvider.getvBoxList(function(error, instanceobj)
    	{
        boxes.instanceList = instanceobj;
        //console.log(boxes.instanceList);
        callback();
        //showView();
    	})
    },
    function(callback){
    	resourceProvider.getIoTHostList(function(error, hostobj)
    	{
        boxes.iotHostList = hostobj;
        //console.log(boxes.iotHostList);
        callback();
      })
    },
    function(callback){
    	resourceProvider.getControllerList(function(error, controllerobj)
    	{
        boxes.controllerList = controllerobj;
        console.log(boxes.controllerList);
        callback();
      })
    }
    ];

	 async.parallel(tasks, function(err) { 
		   console.log('Flow-Centric View Rendering');
//		   console.log(boxes.sbox);
			res.render('flowiovisorviewops.jade', {
         sboxList         : JSON.stringify(boxes.sbox),
         cboxList         : JSON.stringify(boxes.cbox),
         oboxList         : JSON.stringify(boxes.obox),
			sswitchList      : JSON.stringify(boxes.sswitchList),
			cswitchList      : JSON.stringify(boxes.cswitchList),
			oswitchList      : JSON.stringify(boxes.oswitchList),
			instanceList    : JSON.stringify(boxes.instanceList),
			iotHostList    : JSON.stringify(boxes.iotHostList),
//			workloadList     : JSON.stringify(workloadList),
			sovsBridgeStatus : JSON.stringify(boxes.sovsBridgeStatus),
			covsBridgeStatus : JSON.stringify(boxes.covsBridgeStatus),
			oovsBridgeStatus : JSON.stringify(boxes.oovsBridgeStatus),
			controllerList : JSON.stringify(boxes.controllerList)
        	});
        	}
    		);
});

// Route for Flows/Box Measurements View
app.get('/flowboxviewops', function(req, res){
    console.log('Flow Box View Rendering');
    var boxList         = null;
    var switchList      = null;
    var instanceList    = null;
    var workloadList     = 0;
    var ovsBridgeStatus = null;
    var pPathStatus     = null;
    resourceProvider.getpBoxList( function(error,boxobj)
    {
        boxList = boxobj;
        console.log( boxList);
        showView();
    })
    resourceProvider.getvSwitchList(function(error, switchobj)
    {
        switchList = switchobj;
        console.log(switchList);
        showView();
    })

    resourceProvider.getvBoxList(function(error, instanceobj)
    {
        instanceList = instanceobj;
        console.log(instanceList);
        showView();
    })

	resourceProvider.getovsBridgeStatus(function(error, bridgestatusobj)
    {
        ovsBridgeStatus = bridgestatusobj;
        console.log(ovsBridgeStatus);
        showView();
    })

    function showView()
    {
        if(boxList !== null && switchList !== null && instanceList !== null && workloadList !==null &&  ovsBridgeStatus !== null)
        {
                console.log('Flow Box View Rendering');
                res.render('flowboxviewops.jade',{locals: {
                        boxList         : JSON.stringify(boxList),
                        switchList      : JSON.stringify(switchList),
                        instanceList    : JSON.stringify(instanceList),
                        workloadList     : JSON.stringify(workloadList),
                        ovsBridgeStatus : JSON.stringify(ovsBridgeStatus)
                },
                title: 'Flows/Box Measure View'}
                )
        }
    }
});

// Route for Workload View
app.get('/servicecentricviewops', function(req, res){
    console.log('Workload-Centric View Rendering');
    res.render('servicecentricviewops.jade', {title: 'Workload Centric View'})
});

// Route for Flow Rules View
app.get('/opsflowrules/*', function(req, res){
    var configList = null;
    var statList = null;
    var boxID=req.originalUrl;
    boxID=boxID.substring(14,boxID.length);
    resourceProvider.getOpsSDNConfigList(boxID, function(error,configobj)
    {
       	configList = configobj;
       	showView();
    })
    resourceProvider.getOpsSDNStatList(boxID, function(error,statobj)
    {
        statList = statobj;
        console.log(statList);
        showView();
    })
    function showView()
    {
       	if(configList !== null && statList !== null)
       	{
        	console.log('Operator Controller Flow Rules');
		console.log(statList);
		res.render('opssdncontconfig', { title: 'Operator Controller Flow Rules', configList: configList, statList: statList });
               // res.render('opssdncontconfig.jade',{locals: {
               //        	configList : JSON.stringify(configList),
               // },
               // title: 'Operator Controller Flow Rules'}
               // )
        }
    }    
});

// Route for Flow Statistics View
app.get('/opsflowstat', function(req, res){
    var statList = null;
    resourceProvider.getOpsSDNStatList( function(error,statobj)
    {
        statList = statobj;
        console.log(statList);
        showView();
    })
    function showView()
    {
        if(statList !== null)
        {
                console.log('Operator Controller Flow Stats');
                res.render('opssdncontstat', { title: 'Operator Controller Flow Statistics', statList: statList });
        }
    }
});

// Route for Tenant-Vlan Mappings View
app.get('/tenantvlanmapops', function(req, res){
	var tenantList = null;
    //var tenantID=req.originalUrl;
    //tenantID=tenantID.substring(14, tenantID.length);
    //resourceProvider.gettenantvlanmapList(tenantID, function(error, tenantObj)
	resourceProvider.gettenantvlanmapList(function(error, tenantObj)
    {
       	tenantList = tenantObj;
       	showView();
    })
    
    function showView()
    {
       	if(tenantList !== null)
       	{
        	console.log('Tenant-Vlan Flow Path Tracing');
			console.log(tenantList);
			res.render('tenantvlanmapops', { title: 'Tenant Vlan Mappings View', tenantList: tenantList });
		}
    }    
});

// Route for Login View
app.get('/', function(req, res){
    res.render('login.jade', {title: 'MultiView Web Application Login'})
});

// Route for Menu View
app.get('/menu', function(req, res){
       	console.log('Menu Rendering');
	res.render('menu.jade',{locals: {}, title: 'MultiView Menu'})
});

app.get('/login', function(req, res){
    res.render('login.jade',{ title: 'MultiView Web Application Login'})
});

// Web Autentication & Validation
client.on('connection', function (socket) {
    socket.on('login', function(login_info){
        var this_user_name = login_info.user_name,
            this_user_password = login_info.user_password;
        if (this_user_name === '' || this_user_password === '') {
                socket.emit('alert', 'You must fill in both fields');
        } else {
            resourceProvider.getUsers(function (err, listusers){
                if(err) throw err;
                var found = false,
                    location =-1;
                  if (listusers.length) {
                        for (var i in listusers) {
                            if (listusers[i].username === this_user_name) {
                                found = true;
                                if (listusers[i].password === this_user_password) {
                                    //todo: get priority and send to menu page.
                                    if(listusers[i].role === 'operator'){
                                        socket.emit('redirect', 'operator');
                                    }
                                    else{
                                        socket.emit('redirect', 'developer');
                                    }
                                } else {
                                    socket.emit('alert', 'Please retry password');
                                }
                                break;
                            }
                        }

                        if (!found) {
                            socket.emit('alert', 'Sorry, We could not find you.');
                        }
                    }
            })
        }
    });
});

app.set('domain', '0.0.0.0')
app.listen(3012);
console.log("Express Server Running...");
//console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
