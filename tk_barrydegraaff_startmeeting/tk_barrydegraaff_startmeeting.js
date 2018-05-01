/**
This file is part of the StartMeeting Zimlet
Copyright (C) 2014-2018  Barry de Graaff

Bugs and feedback: https://github.com/Zimbra-Community/startmeeting/issues

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see http://www.gnu.org/licenses/.

*/
//Constructor
function tk_barrydegraaff_startmeeting_HandlerObject() {
};


tk_barrydegraaff_startmeeting_HandlerObject.prototype = new ZmZimletBase();
tk_barrydegraaff_startmeeting_HandlerObject.prototype.constructor = tk_barrydegraaff_startmeeting_HandlerObject;

tk_barrydegraaff_startmeeting_HandlerObject.prototype.toString =
function() {
   return "tk_barrydegraaff_startmeeting_HandlerObject";
};

/** 
 * Creates the Zimbra OpenPGP Zimlet, extends {@link https://files.zimbra.com/docs/zimlet/zcs/8.6.0/jsapi-zimbra-doc/symbols/ZmZimletBase.html ZmZimletBase}.
 * @class
 * @extends ZmZimletBase
 *  */
var StartMeeting = tk_barrydegraaff_startmeeting_HandlerObject;

/** 
 * This method gets called when Zimbra Zimlet framework initializes.
 */
StartMeeting.prototype.init = function() {
   try {
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('tk_barrydegraaff_startmeeting').handlerObject;   
   var username = appCtxt.getActiveAccount().name.match(/.*@/);
   username = username[0].replace('@','');
   StartMeeting.URL = zimletInstance._zimletContext.getConfig('startMeetingURL');
   StartMeeting.username = username;
   } catch (err)
   {console.log('StartMeeting zimlet init error: '+err);}
};

/** This method is called when a message is viewed in Zimbra. 
 * See {@link https://files.zimbra.com/docs/zimlet/zcs/8.6.0/jsapi-zimbra-doc/symbols/ZmZimletBase.html#onMsgView}.
 * @param {ZmMailMsg} msg - an email in {@link https://files.zimbra.com/docs/zimlet/zcs/8.6.0/jsapi-zimbra-doc/symbols/ZmMailMsg.html ZmMailMsg} format
 * @param {ZmMailMsg} oldMsg - unused
 * @param {ZmMailMsgView} msgView - the current ZmMailMsgView (upstream documentation needed)
 * */
StartMeeting.prototype.onMsgView = function (msg, oldMsg, msgView) {
   try 
   {
      var zimletInstance = appCtxt._zimletMgr.getZimletByName('tk_barrydegraaff_startmeeting').handlerObject;   
   } catch (err)
   {
      console.log('StartMeeting zimlet onMsgView error: '+err);
   }
};   

/** This method gets called by the Zimlet framework when single-click is performed.
 */
StartMeeting.prototype.singleClicked =
function() {  
   this.prefDialog();
};

/** This method gets called by the Zimlet framework when double-click is performed.
 */
StartMeeting.prototype.doubleClicked =
function() {
   this.prefDialog();
};

/** This method shows a `ZmToast` status message. That fades in and out in a few seconds.
 * @param {string} text - the message to display
 * @param {string} type - the style of the message e.g. ZmStatusView.LEVEL_INFO, ZmStatusView.LEVEL_WARNING, ZmStatusView.LEVEL_CRITICAL
 * */
StartMeeting.prototype.status = function(text, type) {
   var transitions = [ ZmToast.FADE_IN, ZmToast.PAUSE, ZmToast.PAUSE, ZmToast.FADE_OUT ];
   appCtxt.getAppController().setStatusMsg(text, type, null, transitions);
}; 

StartMeeting.prototype.prefDialog =
function() {
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('tk_barrydegraaff_startmeeting').handlerObject;
   zimletInstance._dialog = new ZmDialog( { title:zimletInstance.getMessage('StartMeetingZimlet_label'), parent:this.getShell(), standardButtons:[DwtDialog.OK_BUTTON], disposeOnPopDown:true } );   
   
   zimletInstance._dialog.setContent(
   '<div style="width:450px; height:160px;">'+
   '<img style="margin:10px;margin-left:0px;" src="'+zimletInstance.getResource("logo.svg")+'">'+   
   'Open your wall : <a href="'+StartMeeting.URL+'/wall/'+StartMeeting.username+'" target="_blank">'+StartMeeting.URL +'/wall/'+StartMeeting.username+ '</a>' +
   '</div>'
   );
   
   zimletInstance._dialog.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(zimletInstance, zimletInstance._cancelBtn));
   document.getElementById(zimletInstance._dialog.__internalId+'_handle').style.backgroundColor = '#eeeeee';
   document.getElementById(zimletInstance._dialog.__internalId+'_title').style.textAlign = 'center';
   
   zimletInstance._dialog.popup();  
};   

/** This method is called when the dialog "CANCEL" button is clicked.
 * It pops-down the current dialog.
 */
StartMeeting.prototype._cancelBtn =
function() {
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('tk_barrydegraaff_startmeeting').handlerObject;
   try{
      zimletInstance._dialog.setContent('');
      zimletInstance._dialog.popdown();
   }
   catch (err) {}
};

/**
 * Adds button to Calendar toolbar.
 */
StartMeeting.prototype.initializeToolbar = function(app, toolbar, controller, viewId) {
	var viewType = appCtxt.getViewTypeFromId(viewId);
	if (viewType == ZmId.VIEW_APPOINTMENT) {
		this._initCalendarStartMeetingToolbar(toolbar, controller);
	}
};   

/**
 * Initiates calendar toolbar.
 *
 * @param {ZmToolbar} toolbar	 the Zimbra toolbar
 * @param {ZmCalController} controller  the Zimbra calendar controller
 */
StartMeeting.prototype._initCalendarStartMeetingToolbar = function(toolbar, controller) {
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('tk_barrydegraaff_startmeeting').handlerObject;
	if (!toolbar.getButton("STARTMEETING")) {
		//ZmMsg.sforceAdd = this.getMessage("StartMeetingZimlet_saveAsStartMeeting");
		var buttonIndex = toolbar.opList.length + 1;
		var button = toolbar.createOp("STARTMEETING", {image:"tk_barrydegraaff_startmeeting-panelIcon", text:"StartMeeting", index:buttonIndex});
		toolbar.addOp("STARTMEETING", buttonIndex);

		var menu = new ZmPopupMenu(button); //create menu
		button.setMenu(menu);//add menu to button
		button.noMenuBar = true;
		button.removeAllListeners();
		button.removeDropDownSelectionListener();

      var mi = menu.createMenuItem(Dwt.getNextId(), {image:"tk_barrydegraaff_startmeeting-panelIcon", text:(zimletInstance.getMessage('StartMeetingZimlet_joinHostMeeting').indexOf('???') == 0) ? 'Join or Host Meeting' : zimletInstance.getMessage('StartMeetingZimlet_joinHostMeeting')});
	   mi.addSelectionListener(new AjxListener(this, this._StartMeetingHandler, [controller]));

      var mi = menu.createMenuItem(Dwt.getNextId(), {image:"Add", text:(zimletInstance.getMessage('StartMeetingZimlet_addMeetingDetails').indexOf('???') == 0) ? 'Add StartMeeting information to the Appointment' : zimletInstance.getMessage('StartMeetingZimlet_addMeetingDetails')});    
	   mi.addSelectionListener(new AjxListener(this, this._AddStartMeetingLinkHandler, [controller]));
	}
};

StartMeeting.prototype._AddStartMeetingLinkHandler = function(controller) {
   StartMeeting.prototype.status(ZmMsg.loading, ZmStatusView.LEVEL_INFO);
   var xhr = new XMLHttpRequest();
   xhr.open( "GET", '/service/proxy?target='+StartMeeting.URL+'/wall/'+StartMeeting.username, true );
   xhr.send( );
   xhr.onreadystatechange = function (oEvent) 
   {  
      var access_code = "";
      if (xhr.readyState === 4) 
      {  
         if (xhr.status === 200) 
         {
            try
            {
               access_code = xhr.response.match(/access_code":"(.{6})"/m);
               access_code = access_code[1];
            }
            catch(err)
            {
            }
         }
         
         if(access_code){
            if(access_code.length > 0)
            {
               access_code = 'using Access Code: ' + access_code; 
            }
            else{
               access_code = "";
            }
         }
         else
         {
             access_code = "";
         }
         
         var message = 'To join the Meeting Online go to:\r\n[meetinglink]\r\n\r\nIf you have audio or Internet problems you can join\r\nby calling to the dial-in numbers listed here:\r\n[meetinglink-international] \r\n[access_code]\r\n';   
         var editorType = "HTML";
         if (controller._composeView.getComposeMode() != "text/html") {
            editorType = "PLAIN_TEXT";
         }
         var currentContent = controller._composeView.getHtmlEditor().getContent();
         var newContent = [];
         if (editorType == "HTML") {
            newContent.push(currentContent.substr(0, currentContent.lastIndexOf("</body></html>")));
            newContent.push(message
               .replace(/\r\n/g,'<br>')
               .replace('[meetinglink]','<a href="'+StartMeeting.URL+'/join/'+StartMeeting.username+'" target="_blank">'+StartMeeting.URL+'/join/'+StartMeeting.username+ '</a>')
               .replace('[meetinglink-international]','<a href="'+StartMeeting.URL+'/wall/'+StartMeeting.username+'/#international" target="_blank">'+StartMeeting.URL+'/wall/'+StartMeeting.username+ '/#international</a>')
               .replace('[access_code]',access_code)
            );
            
            newContent.push("</body></html>");
         }
         else {
            newContent.push(currentContent + '\r\n\r\n' +message
               .replace('[meetinglink]',StartMeeting.URL+'/join/'+StartMeeting.username)
               .replace('[meetinglink-international]',StartMeeting.URL+'/wall/'+StartMeeting.username+'/#international')
               .replace('[access_code]',access_code)
            );
         }
         controller._composeView.getHtmlEditor().setContent(newContent.join(""));
      }     
   } 
};

StartMeeting.prototype._StartMeetingHandler = function(controller) {
   var currentContent = controller._composeView.getHtmlEditor().getContent();
   var matches = currentContent.match(/(?:https?:\/\/)?(?:[a-zA-Z 0-9_-]+\.startmeeting\.com\/)([a-zA-Z 0-9_-]+\/[a-zA-Z 0-9_-]+)/);
   if(matches)
   {
      window.open(matches[0]);
   }
   else
   {
      window.open(StartMeeting.URL+'/join/'+StartMeeting.username);
   }
};
