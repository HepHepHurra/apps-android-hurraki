/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var db;
var defaultDirectory;
var SavedPageList="";
var SELECTED_WIKI="http://hurraki.de"
var SHARED_URL="";

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        //app.receivedEvent('deviceready');
		//setDeviceStage();
		//$.noConflict();
			jQuery(function() {
				//app.checkConnection();
                app.createDatabase();
                app.createDefaultDirectory();
                app.loadSettings();
                
                //if(navigator.network.connection.type == Connection.NONE){
                   // alert("Keine Internetverbindung gefunden.");
                //}else{
                    loadPreloader();
                   // loadHomePage();
                  //  addListener();
               // }
			});
			
		
		
    },
    createDefaultDirectory:function(){
        
        var a = new DirManager();
        a.create_r('.hurraki',Log('created successfully'));
        
    },
    createDatabase:function()
    {
        db = window.sqlitePlugin.openDatabase({name: "DB"});
        db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS 'saved_list' ('id'INTEGER NOT NULL,'page_title'TEXT NOT NULL, 'page_language'TEXT NOT NULL,'page_contents'BLOB NOT NULL,'saved_on'INTEGER NOT NULL,PRIMARY KEY('id'));");
            
            tx.executeSql("CREATE TABLE IF NOT EXISTS 'settings' ('id' INTEGER NOT NULL, 'meta_key' TEXT NOT NULL, 'meta_value'TEXT NOT NULL, PRIMARY KEY('id'));");
            
            tx.executeSql("INSERT OR IGNORE INTO `settings` (`id`, `meta_key`, `meta_value`) VALUES (1, 'zoom', '1');");
            tx.executeSql("INSERT OR IGNORE INTO `settings` (`id`, `meta_key`, `meta_value`) VALUES (2, 'language', 'du');");
            
            
            /*db.executeSql("SELECT * FROM 'saved_list';", [], function(tx, res) {
                //SavedPageList=SavedPageList+"<div id='"+res.rows.item(0)+"' style='border-bottom:#999 1px solid;' onclick='LoadSavedPage(this.id)'><h3>"+res.rows.item(1)+"</h3><h4>"+res.rows.item(3)+"</h4></div>";
                console.log("ADED")
            });*/
            
        })
        
    },
    saveData:function(TITLE, DATA,LANGUAGE)
    {
        
        navigator.globalization.dateToString(
          new Date(),
          function (date) {
              
              //alert('date:' + date.value + '\n');
              
                var SQL="INSERT INTO `saved_list` (`id`, `page_title`, `page_language`, `page_contents`, `saved_on`) VALUES (NULL, '"+TITLE+"', '"+LANGUAGE+"', '"+encodeURI(DATA)+"', '"+date.value+"')";
        
                db.executeSql(SQL);
        
                console.log(SQL)
              
          },
          function () {
                        //alert('Error getting dateString\n');
                      },
          {formatLength:'full', selector:'date and time'}
        );
        
    },
    
    updateSettings:function(id,Key, Value)
    {
        var SQL="replace into 'settings' (`id`, `meta_key`, `meta_value`) VALUES ("+id+", '"+Key+"', '"+Value+"')";
        db.executeSql(SQL);
        console.log(SQL);
    },
    loadSettings:function()
    {
        db.executeSql("select meta_value from `settings` where meta_key='zoom'", [], function(res) { 
            if(res){
               for (var i=0; i<res.rows.length; i++){
                   jQuery("#content").css("zoom", "1."+(parseInt(res.rows.item(i).meta_value)-1));
               }              
            }
        });
        
        db.executeSql("select meta_value from `settings` where meta_key='language'", [], function(res) {   
            if(res){
               for (var i=0; i<res.rows.length; i++){
                   defaultLanguage=res.rows.item(i).meta_value
                   loadLanguage();
                   
                   if(defaultLanguage=="en"){
                       SELECTED_WIKI="http://hurraki.org/english"
                   }else if(defaultLanguage=="espanol"){
                       SELECTED_WIKI="http://hurraki.org/espanol"
                   }else{
                       SELECTED_WIKI="http://hurraki.de"
                   }
               }              
            }
        });
    },
    listPage:function()
    {
            var SavedPageList=""
            db = window.sqlitePlugin.openDatabase({name: "DB"});
            db.executeSql("select * from `saved_list`", [], function(tx, res) {          

               SavedPageList=SavedPageList+"<div id='"+res.rows.item(0)+"' style='border-bottom:#999 1px solid;' onclick='LoadSavedPage(this.id)'><h3>"+res.rows.item(1)+"</h3><h4>"+res.rows.item(3)+"</h4></div>";

               console.log("ADDED")

            });
    
            jQuery("#content").html(SavedPageList);
   
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
	
	checkConnection: function() {
		
		/*var networkState = navigator.connection.type;
		var states = {};
		states[Connection.UNKNOWN]  = 'Unknown connection';
		states[Connection.ETHERNET] = 'Ethernet connection';
		states[Connection.WIFI]     = 'WiFi connection';
		states[Connection.CELL_2G]  = 'Cell 2G connection';
		states[Connection.CELL_3G]  = 'Cell 3G connection';
		states[Connection.CELL_4G]  = 'Cell 4G connection';
		states[Connection.NONE]     = 'No network connection';
	
		alert('Connection type: ' + states[networkState]);
		
		 if(navigator.network.connection.type == Connection.NONE){
                alert("nocon");
            }else{
                alert("yescon");
            }*/
			
		/*var element = document.getElementById('Details');
        element.innerHTML = 'Device Model: '    + device.model    + '<br />' +
                            'Device Cordova: '  + device.cordova  + '<br />' +
                            'Device Platform: ' + device.platform + '<br />' +
                            'Device UUID: '     + device.uuid     + '<br />' +
                            'Device Version: '  + device.version  + '<br />';*/	
							
	    var agent = navigator.userAgent;      
		var isWebkit = (agent.indexOf("AppleWebKit") > 0);      
		var isIPad = (agent.indexOf("iPad") > 0);      
		var isIOS = (agent.indexOf("iPhone") > 0 || agent.indexOf("iPod") > 0);     
		var isAndroid = (agent.indexOf("Android")  > 0);     
		var isNewBlackBerry = (agent.indexOf("AppleWebKit") > 0 && agent.indexOf("BlackBerry") > 0);     
		var isWebOS = (agent.indexOf("webOS") > 0);      
		var isWindowsMobile = (agent.indexOf("IEMobile") > 0);     
		var isSmallScreen = (screen.width < 767 || (isAndroid && screen.width < 1000));     
		var isUnknownMobile = (isWebkit && isSmallScreen);     
		var isMobile = (isIOS || isAndroid || isNewBlackBerry || isWebOS || isWindowsMobile || isUnknownMobile);     
		var isTablet = (isIPad || (isMobile && !isSmallScreen));
		
		//alert("Mobile "+isMobile)
		//alert("Tablet "+isTablet)
	}
};
