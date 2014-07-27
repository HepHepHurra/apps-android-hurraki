var httpRequest;
var Container="";
var ELEMENT=".content";

function loadHomePage()
{
    
    var HOMEpageString='<div id="mainpage"><div id="mf-A-Z"><h4><span class="mw-headline"id="W.C3.B6rter_von_A_bis_Z"><div style="color: #">Wörter von A bis Z</div></span></h4></div><br clear="all"><div id="mf-AbisZ"><div style="font-size: 100%"><a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#A"title="Hurraki:Wörter von A bis Z">A</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#B"title="Hurraki:Wörter von A bis Z">B</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#C"title="Hurraki:Wörter von A bis Z">C</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#D"title="Hurraki:Wörter von A bis Z">D</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#E"title="Hurraki:Wörter von A bis Z">E</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#F"title="Hurraki:Wörter von A bis Z">F</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#G"title="Hurraki:Wörter von A bis Z">G</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#H"title="Hurraki:Wörter von A bis Z">H</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#I"title="Hurraki:Wörter von A bis Z">I</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#J"title="Hurraki:Wörter von A bis Z">J</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#K"title="Hurraki:Wörter von A bis Z">K</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#L"title="Hurraki:Wörter von A bis Z">L</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#M"title="Hurraki:Wörter von A bis Z">M</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#N"title="Hurraki:Wörter von A bis Z">N</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#O"title="Hurraki:Wörter von A bis Z">O</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#P"title="Hurraki:Wörter von A bis Z">P</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#Q"title="Hurraki:Wörter von A bis Z">Q</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#R"title="Hurraki:Wörter von A bis Z">R</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#S"title="Hurraki:Wörter von A bis Z">S</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#T"title="Hurraki:Wörter von A bis Z">T</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#U"title="Hurraki:Wörter von A bis Z">U</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#V"title="Hurraki:Wörter von A bis Z">V</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#W"title="Hurraki:Wörter von A bis Z">W</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#X"title="Hurraki:Wörter von A bis Z">X</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#Y"title="Hurraki:Wörter von A bis Z">Y</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#Z"title="Hurraki:Wörter von A bis Z">Z</a></div><br></div><br clear="all"><div id="mf-interessantes"><h4><span class="mw-headline"id="Interessantes"><div style="color: #">Interessantes</div></span></h4></div><br clear="all"><div id="mf-interessantes2"><ul><li>Viele Menschen fallen auf den <a href="/wiki/Enkeltrick"title="Enkeltrick">Enkeltrick</a> herein.</li><li>Dagegen helfen<a href="/wiki/Diskussion:Enkeltrick"title="Diskussion:Enkeltrick"> Tipps der Polizei </a>.</li><li>Die Haupt-<a href="/wiki/FKK"title="FKK"class="mw-redirect">FKK</a>-Zeit hat angefangen.</li></ul></div><br clear="all"><div id="mf-home"><dl><dt><span class="plainlinks"> <a rel="nofollow"target="_blank"class="external text"href="http://hurraki.de/blog/mehr-leichte-sprache-in-niedersachsen/">Mehr Leichte Sprache in Niedersachsen</a></span></dt><dd>Der Landtag in Niedersachsen hat eine eigene Internet-seite.Auf der Internet-seite gibt es jetzt auch einen Schalter für Leichte Sprache.Immer mehr Internet-seiten haben einen Schalter für Leic…</dd></dl><p></p>';
    
    //jQuery("#content").html(HOMEpageString);
    jQuery("#pageHeader").val("#home#");
            
    jQuery('#content a').each(function() {				
					  jQuery(this).click(function(event){
						event.preventDefault();
                          
                            if(jQuery(this).attr('href').indexOf("Hurraki:W%C3%B6rter_von_A_bis_Z#") != -1){
                                onlyFor_A_to_Z_page(SELECTED_WIKI+jQuery(this).attr('href'));
                            }else{
                                if(jQuery(this).attr('href').indexOf("/wiki/") != -1){
                                    loadUrl(SELECTED_WIKI+jQuery(this).attr('href'));
                                }else if(jQuery(this).attr('href').indexOf("/w/") != -1){
                                    window.open(SELECTED_WIKI+jQuery(this).attr('href'), '_blank', 'location=yes');  
                                }else{
                                    window.open(jQuery(this).attr('href'), '_blank', 'location=yes');
                                }
                                    
                            }
                          
					  });
      });
    
    changeSiteForDesktopView();
}

function addListener()
{
	jQuery("#searchInput").click(function() {
        
        jQuery("#mw-mf-viewport559").append('<div class="mw-mf-overlay list-overlay"><div class="header"><button class="cancel"></button><input type="text" id="search2" class="search" name="search"></div><div class="suggestions-results"><p class="mw-mf-overlay-header searchinstruction">Gib oben den Suchbegriff ein.Passende Seitennamen werden dann hier angezeigt.</p></div></div>');
        
         /*jQuery("#mw-mf-viewport559").append('<div class="mw-mf-overlay list-overlay"><div class="header"><button class="cancel"></button><form class="search-box"method="get"action="/w/index.php"><input type="search" id="search2" class="search"name="search"><a class="clear"></a></form></div><div class="suggestions-results"><p class="mw-mf-overlay-header searchinstruction">Gib oben den Suchbegriff ein.Passende Seitennamen werden dann hier angezeigt.</p></div></div>');*/
        
        jQuery( ".search" ).focus();
        
        jQuery(".cancel").click(function() {
            jQuery( ".mw-mf-overlay" ).remove();
        });
        
        jQuery(".clear").click(function() {
            jQuery( ".search" ).val("");
        });
        
        jQuery("#search2").keyup(function(e) {
            if(jQuery("#search2").val()!=""){
                 sortSearchList(jQuery("#search2").val())
            }
        });
        
        loadLanguage();
        
    });

}

function loadLanguage()
{
    
    jQuery.ajax({
        type: "GET" ,
        url: "lang/"+defaultLanguage+".xml" ,
        dataType: "xml" ,
        success: function(xml) {
            
           // console.log(xml);

            jQuery(xml).find('string').each(function(){
                jQuery("."+jQuery(this).attr("id")).html(jQuery(this).text());
                jQuery("#_"+jQuery(this).attr("id")).val(jQuery(this).text());
                jQuery("."+jQuery(this).attr("id")).attr("placeholder", jQuery(this).text());
            });
            
        }
     });
    
     jQuery("#defaultLanguage").val(defaultLanguage)
}

function sortSearchList(SearchedData)
{

    console.log(SELECTED_WIKI+"/w/api.php?action=opensearch&search="+SearchedData+"&format=json&limit=15")
    
	jQuery.ajax({
			url: SELECTED_WIKI+"/w/api.php?action=opensearch&search="+SearchedData+"&format=json&limit=15",
			dataType: "jsonp",
			jsonp: "callback",
            timeout:10000,
			success: function( obj ) {
				
                jQuery(".suggestions-results").html("<ul class='page-list a-to-z actionable'></ul>");
                
                var SearchItems = [];
                
				jQuery.each(obj[1], function( i, item ) {                
                    var STR="<li title='"+item+"'>"+
                                "<a href='/wiki/"+item+"' class='title' name='' data-latlng=',' data-title='"+item+"'>"+
                                    "<div class='listThumb ' style=''></div>"+
                                    "<h2><strong>"+item+"</strong></h2>"+
                                    "<div class='info proximity'></div>"+
                                "</a>"+
                            "</li>";
                    
                    jQuery(".page-list").append(STR);
                    SearchItems.push(STR);
				})

                if(SearchItems.length==0){
                    
                    jQuery("#alertify").remove();
                    
                    alertify.confirm(jQuery("#_search_result_not_found").val(), function (e) {
                        if (e) {
                             window.open('http://hurraki.de/wiki/Spezial:Suche', '_blank', 'location=yes');  
                        } else {
                            // user clicked "cancel"
                        }
                    });
                    
                }
                
                jQuery('.page-list a').each(function() {				
                        jQuery(this).click(function(event){
                                event.preventDefault();
                                jQuery( ".mw-mf-overlay" ).remove();
                            
                                if(jQuery(this).attr('href').indexOf("/wiki/") != -1){
                                    loadUrl(SELECTED_WIKI+jQuery(this).attr('href'));
                                }else if(jQuery(this).attr('href').indexOf("/w/") != -1){
                                    window.open(SELECTED_WIKI+jQuery(this).attr('href'), '_blank', 'location=yes');  
                                }else{
                                    window.open(jQuery(this).attr('href'), '_blank', 'location=yes');
                                }
                        });
                });

			},
			error:function()
			{
				 alertify.alert("Time-Out. Bitte überprüfen Sie Ihre Internetverbindung.");
			}
     });
}

function epv()
{
    
}

function onlyFor_A_to_Z_page(url)
{
    jQuery.ajax({
		url: url,
		dataType: "html",
		async:false,
        timeout:10000,
		crossDomain:true,
		processData : false,
		success: function(obj){
            
            var stringOfHtml = obj;
			var html = jQuery(stringOfHtml);
			html.find('script').remove();
            
            html.find(ELEMENT).find('h2').each(function() {
                    jQuery(this).addClass( "section_heading" );
                    var l="";
                    jQuery(this).nextUntil( "h2" ).each(function() {
                        l=l+"<p>"+jQuery(this).html()+"</p>";
                        jQuery(this).remove();
                    });
                
                    jQuery("<div>"+l+"</div>").insertAfter(jQuery(this));
                    jQuery(this).next().addClass( "content_block" );
			});
            
            
			jQuery("#content").html(html.find('#mw-content-text').html());
            jQuery("#pageHeader").val("#A_to_Z_page#");
            
            
            jQuery('#content a').each(function() {				
					  jQuery(this).click(function(event){
                          
						    event.preventDefault();
                          
						    if(jQuery(this).attr('href').indexOf("Hurraki:W%C3%B6rter_von_A_bis_Z#") != -1){
                                onlyFor_A_to_Z_page(SELECTED_WIKI+jQuery(this).attr('href'));
                            }else{
                                if(jQuery(this).attr('href').indexOf("/wiki/") != -1){
                                    loadUrl(SELECTED_WIKI+jQuery(this).attr('href'));
                                }else if(jQuery(this).attr('href').indexOf("/w/") != -1){
                                    window.open(SELECTED_WIKI+jQuery(this).attr('href'), '_blank', 'location=yes');  
                                }else{
                                    window.open(jQuery(this).attr('href'), '_blank', 'location=yes');
                                }
                            }
                          
					  });
            });
            
            jQuery('.section_heading').on("click", function () {
                    jQuery(this).toggleClass('openSection');
                    jQuery(this).next().toggleClass('openSection');
            });
		},
		error:function()
		{
             alertify.alert("Time-Out. Bitte überprüfen Sie Ihre Internetverbindung.");
		}
	});
}

function loadUrl(url)
{
    SHARED_URL=url;
    
    jQuery.ajax({
		url: url,
		dataType: "html",
		async:false,
        timeout:10000,
		crossDomain:true,
		processData : false,
		success: function(obj){
            
            var stringOfHtml = obj;
			var html = jQuery(stringOfHtml);
            
            html.find(ELEMENT).find('img').each(function() {
				jQuery(this).attr('src', SELECTED_WIKI+jQuery(this).attr('src'));
                var modifiedUrl=jQuery(this).attr('src').replace('/english/english','/english').replace('/espanol/espanol','/espanol');
                jQuery(this).attr('src', modifiedUrl);
                
				console.log("loaded_img>"+jQuery(this).attr('src'));
			});
            
            html.find(ELEMENT).find('table').last().css("display", "none");
            
            /*html.find('.content').find('a').each(function() {				
					  jQuery(this).click(function(event){
						event.preventDefault();
                           console.log("The Clicked Item> ")
                            if(jQuery(this).attr('href').indexOf("Hurraki:W%C3%B6rter_von_A_bis_Z#") != -1){
                                onlyFor_A_to_Z_page(SELECTED_WIKI+jQuery(this).attr('href'));
                            }else{
                                if(jQuery(this).attr('href').indexOf("/wiki/") != -1){
                                    loadUrl(SELECTED_WIKI+jQuery(this).attr('href'));
                                }else{
                                    window.open(SELECTED_WIKI+jQuery(this).attr('href'), '_system');   
                                    console.log("The Clicked Item> "+jQuery(this).attr('href'))
                                }
                            }
                          
					  });
            });*/
            
            
            
            html.find(ELEMENT).find('h2').each(function() {
                    jQuery(this).addClass( "section_heading" );
                    //jQuery(this).nextUntil( "h2" ).replaceWith("<div>32</div>");
                   
                    var l="";
                    jQuery(this).nextUntil( "h2" ).each(function() {
                        l=l+"<p>"+jQuery(this).html()+"</p>";
                        jQuery(this).remove();
                    });
                
                    jQuery("<div>"+l+"</div>").insertAfter(jQuery(this));
                    jQuery(this).next().addClass( "content_block" );
			});
            
            html.find(ELEMENT).find('.new').each(function() {
					jQuery(this).removeAttr("href");
                    jQuery(this).css("color", "#000000");
            });
            
            html.find(ELEMENT).find('.image').each(function() {
					//jQuery(this).attr('href', "#");
            });

            
            //jQuery("#content").html("<h1 id='section_0' style='padding:12px 14px 7px 0px'>"+html.find("#firstHeading > span").html()+"</h1><div style='width:100%; height:auto' id='"+encodeURI(html.find("#firstHeading > span").html())+"' class='no' align='right' onclick='dotheshare(this.id)'><img src='img/share.png' width='30' height='30' /></div>"+html.find("#mw-content-text").html());
            
            var FacebookCode='<a class="social_link" href="https://www.facebook.com/sharer/sharer.php?u='+encodeURI(SHARED_URL)+'" target="_blank" id="u_0_1"><span style="padding-left: 19px;" class="uiIconText"><img class="img" src="img/fb.png" alt="" style="top: 0px;" width="14" height="14">Share</span></a>';
            
            var GooglePlus='<a class="social_link" href="https://plus.google.com/share?url='+encodeURI(SHARED_URL)+'" target="_blank" id="u_0_1"><span style="padding-left: 19px;" class="uiIconText"><img class="img" src="img/gplus-16.png" alt="" style="top: 0px;" width="14" height="14">Share</span></a>';
            
            var Twitter='<a class="social_link" href="http://www.twitter.com/share?url='+encodeURI(SHARED_URL)+'" target="_blank" id="u_0_1"><span style="padding-left: 19px;" class="uiIconText"><img class="img" src="img/twitter-small.png" alt="" style="top: 0px;" width="14" height="14">Share</span></a>';
            
            http://www.twitter.com/share?url=http://www.google.com
            
            jQuery("#content").html("<h1 id='section_0' style='padding:12px 14px 7px 0px'>"+html.find("#firstHeading > span").html()+"</h1><div style='width:100%; height:40px' id='"+encodeURI(html.find("#firstHeading > span").html())+"' class='no' align='right'>"+FacebookCode+GooglePlus+Twitter+"</div>"+html.find("#mw-content-text").html());
            
            
            jQuery('input#pageHeader').val(html.find("#firstHeading > span").html())
            
            jQuery('#content .section_heading').on("click", function () {
                    jQuery(this).toggleClass('openSection');
                    jQuery(this).next().toggleClass('openSection');
            });
            
            jQuery('#content a').each(function() {				
					  jQuery(this).click(function(event){
						event.preventDefault();
                          if(jQuery(this).attr('class').indexOf("social_link") == -1){
                            if(jQuery(this).attr('href').indexOf("Hurraki:W%C3%B6rter_von_A_bis_Z#") != -1){
                                onlyFor_A_to_Z_page(SELECTED_WIKI+jQuery(this).attr('href'));
                            }else{
                                if(jQuery(this).attr('href').indexOf("/wiki/") != -1){
                                    loadUrl(SELECTED_WIKI+jQuery(this).attr('href'));
                                }else if(jQuery(this).attr('href').indexOf("/w/") != -1){
                                    window.open(SELECTED_WIKI+jQuery(this).attr('href'), '_blank', 'location=yes');  
                                }else{
                                    window.open(jQuery(this).attr('href'), '_blank', 'location=yes');
                                }
                            }
                          }else{
                                window.open(jQuery(this).attr('href'), '_blank', 'location=yes');
                          }
					  });
            });
            
            jQuery('#content img').each(function() {       
                var b = new FileManager();
                var iTag=jQuery(this)
                
                
                if(jQuery(this).attr('src').indexOf("img/fb.png") == -1 && jQuery(this).attr('src').indexOf("img/gplus-16.png") == -1 && jQuery(this).attr('src').indexOf("img/twitter-small.png") == -1){
                    
                    if(jQuery(this).attr('src').indexOf("http://") == -1){
                        jQuery(this).attr('src', SELECTED_WIKI+jQuery(this).attr('src'));
                        var modifiedUrl=jQuery(this).attr('src').replace('/english/english','/english').replace('/espanol/espanol','/espanol');
                        jQuery(this).attr('src', modifiedUrl);
                    }

                    var fileName=(jQuery(this).attr('src').match(/.*\/(.*)$/)[1])

                    b.download_file(jQuery(this).attr('src'),'.hurraki/',fileName,function(theFile){
                        iTag.attr('src', theFile.toURI());
                        console.log("Replaced>"+theFile.toURI())
                    });
                }
                
            })
            
		},
		error:function()
		{
            alertify.alert("Time-Out. Bitte überprüfen Sie Ihre Internetverbindung.");
		}
	});
}

function fail(evt) {
        console.log(evt.target.error.code);
    }

//https://gist.github.com/HaNdTriX/7704632
//http://jsfiddle.net/handtrix/YvQ5y/
function convertImgToBase64(url, callback, outputFormat){
	var canvas = document.createElement('CANVAS');
	var ctx = canvas.getContext('2d');
	var img = new Image;
	img.crossOrigin = 'Anonymous';
	img.onload = function(){
		canvas.height = img.height;
		canvas.width = img.width;
	  	ctx.drawImage(img,0,0);
        
	  	var dataURL = canvas.toDataURL()//.toDataURL(outputFormat || 'image/png');
	  	callback.call(this, dataURL);
        // Clean up
	  	canvas = null; 
	};
	img.src = url;
}

function SavePage()
{
    if(jQuery("#pageHeader").val()!="#A_to_Z_page#" && 
       jQuery("#pageHeader").val()!="#saved_page#" && 
       jQuery("#pageHeader").val()!="#saved_page#" && 
       jQuery("#pageHeader").val()!="#settings_page#" && 
       jQuery("#pageHeader").val()!="#home#"){
        
        app.saveData(jQuery('input#pageHeader').val(), jQuery("#content").html(), jQuery("#defaultLanguage").val());
        alertify.alert(jQuery("#_page_have_been_saved").val());
        
    }
}

function ShowSavePage()
{
   // var SavedPageList=""
    
    jQuery("#content").html("");
        
    jQuery("#pageHeader").val("#saved_page#");
    
    var saved_on="Gespeichert am "
    
    db.transaction(function(tx) {
           db.executeSql("SELECT * FROM `saved_list`  ORDER BY saved_on DESC", [], function(res) {          
                
                //SavedPageList=SavedPageList+"<div id='"+res.rows.item(0)+"' style='border-bottom:#999 1px solid;' onclick='LoadSavedPage(this.id)'><h3>"+res.rows.item(1)+"</h3><h4>"+res.rows.item(3)+"</h4></div>";
               console.log("ME CALLED"+res.rows.length)
               
               for (var i=0; i<res.rows.length; i++){
                   
                   if(defaultLanguage=="du"){
                       saved_on="Gespeichert am "
                   }else if(defaultLanguage=="espanol"){
                       saved_on="Guardado en "
                   }else{
                       saved_on="Saved on "
                   }
                   
                   
                   
                   console.log("saved_on> "+saved_on)
                    jQuery("#content").append("<div id='"+res.rows.item(i).id+"' style='border-bottom:#999 1px solid;' onclick='LoadSavedPage(this.id)'><h3>"+res.rows.item(i).page_title+"</h3><h4><span id='saved_on'>"+saved_on+"</span> "+res.rows.item(i).saved_on+"</h4></div>")
                   
               }
               
               if(res.length==0){
                   jQuery("#content").html("Nothing Found");
               }
               
               loadLanguage();
          });
    })
    
}

function LoadSavedPage(id)
{
    jQuery("#pageHeader").val("#saved_page#");
    
    db.transaction(function(tx) {
           db.executeSql("SELECT page_language, page_contents FROM `saved_list` WHERE id="+id, [], function(res) {
               
               for (var i=0; i<res.rows.length; i++){
                   
                   jQuery("#defaultLanguage").val(res.rows.item(i).page_language)
                   
                   // Change settings on Load Language
                   defaultLanguage=res.rows.item(i).page_language
                   loadLanguage();
                   
                   
                   
                   if(jQuery("#defaultLanguage").val()=="en"){
                       SELECTED_WIKI="http://hurraki.org/english"
                   }else if(jQuery("#defaultLanguage").val()=="espanol"){
                       SELECTED_WIKI="http://hurraki.org/espanol"
                   }else{
                       SELECTED_WIKI="http://hurraki.de"
                   }
                   
                   jQuery("#content").html(decodeURI(res.rows.item(i).page_contents));
                   
                   jQuery('#content .section_heading').on("click", function () {
                        jQuery(this).toggleClass('openSection');
                        jQuery(this).next().toggleClass('openSection');
                   });
                   
                   jQuery('#content a').each(function() {				
					  jQuery(this).click(function(event){
						event.preventDefault();
                          if(jQuery(this).attr('class').indexOf("social_link") == -1){
                            if(jQuery(this).attr('href').indexOf("Hurraki:W%C3%B6rter_von_A_bis_Z#") != -1){
                                onlyFor_A_to_Z_page(SELECTED_WIKI+jQuery(this).attr('href'));
                            }else{
                                if(jQuery(this).attr('href').indexOf("/wiki/") != -1){
                                    loadUrl(SELECTED_WIKI+jQuery(this).attr('href'));
                                }else if(jQuery(this).attr('href').indexOf("/w/") != -1){
                                    window.open(SELECTED_WIKI+jQuery(this).attr('href'), '_blank', 'location=yes');  
                                }else{
                                    window.open(jQuery(this).attr('href'), '_blank', 'location=yes');
                                }
                            }
                          }else{
                                window.open(jQuery(this).attr('href'), '_blank', 'location=yes');
                          }
					  });
                    });
                   
               }
          });
    });
}

function dotheshare(title)
{
    
    var message = {
        text: decodeURI(title),
        url: SHARED_URL,
        image: "http://www.hurraki.de/LS-Hurraki-Logo/logo.png"
    };
    
    window.socialmessage.send(message);
}

function loadPreloader()
{
    
    jQuery("#mw-mf-viewport559").append('<div class="mw-mf-overlay list-overlay"><div style="width:'+jQuery(window).width()+'px; height:'+jQuery(window).height()+'px; background:#FFF"><div id="theLogo"style="margin: auto; background-image:url(img/logo.png);  height:135px; width:134px; display: block; position:absolute; top: 0; bottom: 0; left: 0; right: 0; z-index:1;"></div><div style="margin: auto; height: 19px; width: 100%; display: block; position:absolute; top: 191; bottom: 0; left: 0; right: 0; z-index:1; text-align: center; font-style: italic;">Das Wörterbuch für Leichte Sprache</div></div>');
    
    setTimeout(function(){
        if(navigator.network.connection.type == Connection.NONE){
            alertify.alert("Keine Internetverbindung gefunden.");
            jQuery( ".mw-mf-overlay" ).remove();
        }else{
            jQuery( ".mw-mf-overlay" ).remove();
            loadHomePage();
            addListener();
        }
        
    },3000);
}

function loadSettingsPage()
{
    Container= jQuery("#content").html();
    
    console.log("Hitted")
    
    db.executeSql("select meta_key, meta_value from `settings`", [], function(res) { 
        
        var zoomLoop=""
        var LANGUAGE=""
        
        if(res.length==0){
            
            var i='<div><h2 class="change_settings">Change Settings</h2><p class="change_settings_from_here">Change settings from here.</p><div><h3 class="change_language">Change Language</h3><select name="1anguage"id="language"><option class="language_german"value="du">Deutsch</option><option class="language_english"value="en">English</option><option class="language_espanol" value="espanol">Español</option></select></div><div style="padding-top: 11px;"><h3 class="change_font_size">Change Font Size</h3><select name="zoom"id="zoom"><option value="1">1x</option><option value="2">2x</option><option value="3">3x</option><option value="4">4x</option></select></div><div style="padding-top: 21px;"><input class="apply"name="apply"type="button"value="Ok"onclick="changeSettings()"/></div></div>';
    
            jQuery("#content").html(i);
            jQuery("#pageHeader").val("#settings_page#");
            loadLanguage();
            
        }else{
            for (var set=0; set<res.rows.length; set++){
                
                if(res.rows.item(set).meta_key=="language"){
                    if(res.rows.item(set).meta_value=="en"){
                        
                        LANGUAGE='<option class="language_german" value="du">Deutsch</option><option selected="selected" class="language_english" value="en">English</option><option class="language_espanol" value="espanol">Español</option>';
                        
                    }else if(defaultLanguage=="espanol"){    
                        
                        LANGUAGE='<option class="language_german" value="du">Deutsch</option><option class="language_english" value="en">English</option><option selected="selected" class="language_espanol" value="espanol">Español</option>';
                        
                    }else{
                        
                        LANGUAGE='<option class="language_german" selected="selected" value="du">Deutsch</option><option class="language_english" value="en">English</option><option class="language_espanol" value="espanol">Español</option>';
                        
                    }
                }
                
                if(res.rows.item(set).meta_key=="zoom"){
                    
                    for (var i=0; i<4; i++){
                        if((i+1)==parseInt(res.rows.item(set).meta_value)){
                            zoomLoop=zoomLoop+'<option selected="selected" value="'+(i+1)+'">'+(i+1)+'x</option>'
                        }else{
                            zoomLoop=zoomLoop+'<option value="'+(i+1)+'">'+(i+1)+'x</option>'
                        }
                    }
                    
                }
                
            }
            
            var i='<div><h2 class="change_settings">Change Settings</h2><p class="change_settings_from_here">Change settings from here.</p><div><h3 class="change_language">Change Language</h3><select name="1anguage"id="language">'+LANGUAGE+'</select></div><div style="padding-top: 11px;"><h3 class="change_font_size">Change Font Size</h3><select name="zoom"id="zoom">'+zoomLoop+'</select></div><div style="padding-top: 21px;"><input class="apply"name="apply"type="button"value="Ok"onclick="changeSettings()"/></div></div>';
                
            jQuery("#content").html(i);
            jQuery("#pageHeader").val("#settings_page#");
            loadLanguage();
        }
    }) 
}



function changeSettings()
{
    jQuery("#content").css("zoom", "1."+(jQuery("#zoom").val()-1));
    
    /*if(jQuery("#defaultLanguage").val()!=jQuery("#language").val()){
        changeSiteForDesktopView();
    }*/
    
    defaultLanguage=jQuery("#language").val()
    
    
    if(defaultLanguage=="en"){
        SELECTED_WIKI="http://hurraki.org/english"
    }else if(defaultLanguage=="espanol"){
        SELECTED_WIKI="http://hurraki.org/espanol"
    }else{
        SELECTED_WIKI="http://hurraki.de"
    }
    
    app.updateSettings(1,"zoom", jQuery("#zoom").val());
    app.updateSettings(2,"language", jQuery("#language").val());
    
    
    jQuery("#content").html("");
        
    if(jQuery("#pageHeader").val()=="saved_page"){
        ShowSavePage()
    }else{
        jQuery("#content").html(Container);
    }
    
    if(jQuery("#defaultLanguage").val()!=defaultLanguage){
        changeSiteForDesktopView();
    }
    
    loadLanguage();
}



function changeSiteForDesktopView()
{
    var URL=""
    
    if(defaultLanguage=="en"){
        URL="http://hurraki.org/english/w/index.php?title=Main_Page&mobileaction=toggle_view_desktop"
    }else if(defaultLanguage=="espanol"){
        URL="http://hurraki.org/espanol/w/index.php?title=Página_principal&mobileaction=toggle_view_desktop"
    }else{
        URL="http://hurraki.de/w/index.php?title=Hauptseite&mobileaction=toggle_view_desktop"
    }
    
  
    jQuery.ajax({
		url: URL,//http://hurraki.de/wiki/Hauptseite
		dataType: "html",
		async:false,
        timeout:1000,
		crossDomain:true,
		processData : false,
		success: function(obj){
            
            var stringOfHtml = obj;
			var html = jQuery(stringOfHtml);
			html.find('script').remove();
            
            if(html.find(ELEMENT).length<1){
                 ELEMENT="#bodyContent"
            }else{
                 ELEMENT=".content"
            }
            
            var Homepage='<div id="mainpage"><div id="mf-A-Z"><h4><span class="mw-headline"id="W.C3.B6rter_von_A_bis_Z"><div style="color: #">Wörter von A bis Z</div></span></h4></div><br clear="all"><div id="mf-AbisZ"><div style="font-size: 100%"><a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#A"title="Hurraki:Wörter von A bis Z">A</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#B"title="Hurraki:Wörter von A bis Z">B</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#C"title="Hurraki:Wörter von A bis Z">C</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#D"title="Hurraki:Wörter von A bis Z">D</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#E"title="Hurraki:Wörter von A bis Z">E</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#F"title="Hurraki:Wörter von A bis Z">F</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#G"title="Hurraki:Wörter von A bis Z">G</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#H"title="Hurraki:Wörter von A bis Z">H</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#I"title="Hurraki:Wörter von A bis Z">I</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#J"title="Hurraki:Wörter von A bis Z">J</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#K"title="Hurraki:Wörter von A bis Z">K</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#L"title="Hurraki:Wörter von A bis Z">L</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#M"title="Hurraki:Wörter von A bis Z">M</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#N"title="Hurraki:Wörter von A bis Z">N</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#O"title="Hurraki:Wörter von A bis Z">O</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#P"title="Hurraki:Wörter von A bis Z">P</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#Q"title="Hurraki:Wörter von A bis Z">Q</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#R"title="Hurraki:Wörter von A bis Z">R</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#S"title="Hurraki:Wörter von A bis Z">S</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#T"title="Hurraki:Wörter von A bis Z">T</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#U"title="Hurraki:Wörter von A bis Z">U</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#V"title="Hurraki:Wörter von A bis Z">V</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#W"title="Hurraki:Wörter von A bis Z">W</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#X"title="Hurraki:Wörter von A bis Z">X</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#Y"title="Hurraki:Wörter von A bis Z">Y</a>&nbsp;&nbsp; <a href="/wiki/Hurraki:W%C3%B6rter_von_A_bis_Z#Z"title="Hurraki:Wörter von A bis Z">Z</a></div><br></div><br clear="all">'
            
            if(defaultLanguage=="en"){
                
                var HTML='<br clear="all"><div id="mf-home">'+html.find("#mf-home").html()+'</div>'
                
                
                if(html.find("#mf-News").eq(1).length>0) {
                    HTML=HTML+'<div id="mf-News"><h4><span class="mw-headline" id="News"><b>'+html.find("#mf-News").eq(0).html()+'</b></span></h4></div>'+'<div id="mf-News">'+html.find("#mf-News").eq(1).html()+'</div>'
                }
                
                jQuery("#content").html(HTML);

                
            }else if(defaultLanguage=="espanol"){
                
                var HTML='<br clear="all"><div id="mf-home">'+html.find("#mf-home").html()+'</div>'
                
                
                if(html.find("#mf-Nuevas_palabras").eq(0).length>0) {
                    HTML=HTML+'<div id="mf-Nuevas_palabras">'+html.find("#mf-Nuevas_palabras").eq(0).html()+'</div>'+'<div id="mf-Nuevas_palabras">'+html.find("#mf-Nuevas_palabras").eq(1).html()+'</div>'
                }
                
                jQuery("#content").html(HTML);
                
            }else{
                
                jQuery("#content").html(Homepage+'<div id="mf-interessantes">'+html.find("#mf-interessantes").html()+'</div><div id="mf-interessantes2">'+html.find("#mf-interessantes2").html()+'</div>'+'<br clear="all"><div id="mf-home">'+html.find("#mf-home").html()+'</div>');
                
            }
            
            //jQuery("#content").html(Homepage+'<div id="mf-interessantes">'+html.find("#mf-interessantes").html()+'</div><div id="mf-interessantes2">'+html.find("#mf-interessantes2").html()+'</div>'+'<br clear="all"><div id="mf-home">'+html.find("#mf-home").html()+'</div>');
            
            
            jQuery('#content a').each(function() {				
					  jQuery(this).click(function(event){
						event.preventDefault();
                          
                          
                          
                            if(jQuery(this).attr('href').indexOf("Hurraki:W%C3%B6rter_von_A_bis_Z#") != -1){
                                onlyFor_A_to_Z_page(SELECTED_WIKI+jQuery(this).attr('href'));
                            }else{
                                if(jQuery(this).attr('href').indexOf("/wiki/") != -1){
                                    var URL_=SELECTED_WIKI+jQuery(this).attr('href')
                                    URL_=URL_.replace('/english/english','/english').replace('/espanol/espanol','/espanol')
                                    
                                    loadUrl(URL_);
                                }else if(jQuery(this).attr('href').indexOf("/w/") != -1){
                                    var URL_=SELECTED_WIKI+jQuery(this).attr('href')
                                    URL_=URL_.replace('/english/english','/english').replace('/espanol/espanol','/espanol')
                                    
                                    window.open(URL_, '_blank', 'location=yes'); 
                                }else{
                                    window.open(jQuery(this).attr('href'), '_blank', 'location=yes');
                                }
                            }
					  });
            });
            
		},
		error: function(jqXHR, textStatus){
            if(textStatus == 'timeout')
            {     
                 alertify.alert("Time-Out. Bitte überprüfen Sie Ihre Internetverbindung.");
            }
        }
	});
}