Ext.namespace("Ext.ux.form");(function(){var a=Ext.ux;a.BaseTimePicker=Ext.extend(Ext.Panel,{timeFormat:"g:i A",header:true,nowText:"Now",doneText:"Done",hourIncremenet:1,minIncremenet:1,hoursLabel:"Hours",minsLabel:"Minutes",cls:"ux-base-time-picker",width:210,layout:"form",labelAlign:"top",initComponent:function(){this.addEvents("select");this.hourSlider=new Ext.slider.SingleSlider({increment:this.hourIncremenet,minValue:0,maxValue:23,fieldLabel:this.hoursLabel,listeners:{change:this._updateTimeValue,scope:this},plugins:new Ext.slider.Tip()});this.minSlider=new Ext.slider.SingleSlider({increment:this.minIncremenet,minValue:0,maxValue:59,fieldLabel:this.minsLabel,listeners:{change:this._updateTimeValue,scope:this},plugins:new Ext.slider.Tip()});this.setCurrentTime(false);this.items=[this.hourSlider,this.minSlider];this.bbar=[{text:this.nowText,handler:this.setCurrentTime,scope:this},"->",{text:this.doneText,handler:this.onDone,scope:this}];a.BaseTimePicker.superclass.initComponent.call(this)},setCurrentTime:function(b){this.setValue(new Date(),!!b)},onDone:function(){this.fireEvent("select",this,this.getValue())},setValue:function(c,b){this.hourSlider.setValue(c.getHours(),b);this.minSlider.setValue(c.getMinutes(),b);this._updateTimeValue()},_extractValue:function(){var b=new Date();b.setHours(this.hourSlider.getValue());b.setMinutes(this.minSlider.getValue());return b},getValue:function(){return this._extractValue()},_updateTimeValue:function(){var b=this._extractValue().format(this.timeFormat);if(this.rendered){this.setTitle(b)}},afterRender:function(){a.BaseTimePicker.superclass.afterRender.call(this);this._updateTimeValue()},destroy:function(){this.purgeListeners();this.hourSlider=null;this.minSlider=null;a.BaseTimePicker.superclass.destroy.call(this)}});Ext.reg("basetimepicker",a.BaseTimePicker)})();(function(){var a=Ext.ux;var c="ux-date-time-picker";a.DateTimePicker=Ext.extend(Ext.BoxComponent,{timeLabel:"Time",timeFormat:"g:i A",changeTimeText:"Change...",doneText:"Done",initComponent:function(){a.DateTimePicker.superclass.initComponent.call(this);this.addEvents("select");this.timePickerButton=new Ext.Button({text:this.changeTimeText,handler:this._showTimePicker,scope:this});this._initDatePicker();this.timeValue=new Date();if(this.value){this.setValue(this.value);delete this.value}},_initTimePicker:function(){if(!this.timeMenu){var d=this.initialConfig.timeMenu;if(d&&d.xtype){this.timeMenu=Ext.create(d)}else{var e=Ext.create(Ext.applyIf(this.initialConfig.timePicker||{},{timeFormat:this.timeFormat}),"basetimepicker");this.timeMenu=new b(e,d||{})}if(!Ext.isFunction(this.timeMenu.getPicker)){throw"Your time menu must provide the getPicker() method"}this.timeMenu.on("timeselect",this.onTimeSelect,this)}},_initDatePicker:function(){var e=this.initialConfig.datePicker||{};e.internalRender=this.initialConfig.internalRender;Ext.applyIf(e,{format:this.dateFormat||Ext.DatePicker.prototype.format});var d=this.datePicker=Ext.create(e,"datepicker");d.update=d.update.createSequence(function(){if(this.el!=null&&this.datePicker.rendered){var f=this.datePicker.el.getWidth();this.el.setWidth(f+this.el.getBorderWidth("lr")+this.el.getPadding("lr"))}},this)},_renderDatePicker:function(g){var e=this.datePicker;e.render(g);var j=e.getEl().child(".x-date-bottom");var f=j.getSize(true);var h=["position: absolute","bottom: 0","left: 0","overflow: hidden","width: "+f.width+"px","height: "+f.height+"px"].join(";");var i=g.createChild({tag:"div",cls:"x-date-bottom",style:h,children:[{tag:"table",cellspacing:0,style:"width: 100%",children:[{tag:"tr",children:[{tag:"td",align:"left"},{tag:"td",align:"right"}]}]}]});if(e.showToday){var d={};Ext.each(["text","tooltip","handler","scope"],function(k){d[k]=e.todayBtn.initialConfig[k]});this.todayBtn=new Ext.Button(d).render(i.child("td:first"))}this.doneBtn=new Ext.Button({text:this.doneText,handler:this.onDone,scope:this}).render(i.child("td:last"))},_getFormattedTimeValue:function(d){return d.format(this.timeFormat)},_renderValueField:function(f){var e=c+"-value-ct";var d=!Ext.isEmpty(this.timeLabel)?'<span class="'+e+'-value-label">'+this.timeLabel+":</span>&nbsp;":"";var h=f.insertFirst({tag:"div",cls:[e,"x-date-bottom"].join(" ")});var g=h.createChild({tag:"table",cellspacing:0,style:"width: 100%",children:[{tag:"tr",children:[{tag:"td",align:"left",cls:e+"-value-cell",html:'<div class="'+e+'-value-wrap">'+d+'<span class="'+e+'-value">'+this._getFormattedTimeValue(this.timeValue)+"</span></div>"},{tag:"td",align:"right",cls:e+"-btn-cell"}]}]});this.timeValueEl=g.child("."+e+"-value");this.timeValueEl.on("click",this._showTimePicker,this);this.timePickerButton.render(g.child("td:last"))},onRender:function(e,d){this.el=e.createChild({tag:"div",cls:c,children:[{tag:"div",cls:c+"-inner"}]},d);a.DateTimePicker.superclass.onRender.call(this,e,d);var f=this.el.first();this._renderDatePicker(f);this._renderValueField(f)},_updateTimeValue:function(d){this.timeValue=d;if(this.timeValueEl!=null){this.timeValueEl.update(this._getFormattedTimeValue(d))}},setValue:function(d){this._updateTimeValue(d);this.datePicker.setValue(d.clone())},getValue:function(){var d=this.datePicker.getValue();var e=this.timeValue.getElapsed(this.timeValue.clone().clearTime());return new Date(d.getTime()+e)},onTimeSelect:function(f,d,e){this._updateTimeValue(e)},_showTimePicker:function(){this._initTimePicker();this.timeMenu.getPicker().setValue(this.timeValue,false);if(this.timeMenu.isVisible()){this.timeMenu.hide()}else{this.timeMenu.show(this.timePickerButton.el,null,this.parentMenu)}},onDone:function(){this.fireEvent("select",this,this.getValue())},destroy:function(){Ext.destroy(this.timePickerButton);this.timePickerButton=null;if(this.timeValueEl){this.timeValueEl.remove();this.timeValueEl=null}Ext.destroy(this.datePicker);this.datePicker=null;if(this.timeMenu){Ext.destroy(this.timeMenu);this.timeMenu=null}if(this.todayBtn){Ext.destroy(this.todayBtn);this.todayBtn=null}if(this.doneBtn){Ext.destroy(this.doneBtn);this.doneBtn=null}this.parentMenu=null;a.DateTimePicker.superclass.destroy.call(this)}});Ext.reg("datetimepicker",a.DateTimePicker);var b=a.DateTimePicker.Menu=Ext.extend(Ext.menu.Menu,{enableScrolling:false,hideOnClick:false,plain:true,showSeparator:false,constructor:function(e,d){d=d||{};if(d.picker){delete d.picker}this.picker=Ext.create(e);b.superclass.constructor.call(this,Ext.applyIf({items:this.picker},d));this.addEvents("timeselect");this.picker.on("select",this.onTimeSelect,this)},getPicker:function(){return this.picker},onTimeSelect:function(d,e){this.hide();this.fireEvent("timeselect",this,d,e)},destroy:function(){this.purgeListeners();this.picker=null;b.superclass.destroy.call(this)}})})();(function(){var c=Ext.ux.form;var a=Ext.isIE7&&Ext.isStrict;var b=Ext.extend(Ext.menu.Menu,{enableScrolling:false,plain:true,showSeparator:false,hideOnClick:true,pickerId:null,cls:"x-date-menu x-date-time-menu",constructor:function(e,d){b.superclass.constructor.call(this,Ext.applyIf({items:e},d||{}));this.primaryPicker=e;e.parentMenu=this;this.on("beforeshow",this.onBeforeShow,this);this.strict=a;if(this.strict){this.on("show",this.onShow,this,{single:true,delay:20})}this.picker=e.datePicker;this.relayEvents(e,["select"]);this.on("show",e.focus,e);this.on("select",this.menuHide,this);if(this.handler){this.on("select",this.handler,this.scope||this)}},menuHide:function(){if(this.hideOnClick){this.hide(true)}},onBeforeShow:function(){if(this.picker){this.picker.hideMonthPicker(true)}},onShow:function(){var d=this.picker.getEl();d.setWidth(d.getWidth())},destroy:function(){this.primaryPicker=null;this.picker=null;b.superclass.destroy.call(this)}});c.DateTimeField=Ext.extend(Ext.form.DateField,{timeFormat:"g:i A",defaultAutoCreate:{tag:"input",type:"text",size:"22",autocomplete:"off"},initComponent:function(){c.DateTimeField.superclass.initComponent.call(this);this.dateFormat=this.dateFormat||this.format;var d=this._createPicker();this.format=this.dateFormat+" "+this.timeFormat;this.menu=new b(d,{hideOnClick:false})},_createPicker:function(){var d=this.initialConfig.picker||{};Ext.apply(d,{ctCls:"x-menu-date-item",internalRender:a||!Ext.isIE});Ext.applyIf(d,{dateFormat:this.dateFormat,timeFormat:this.timeFormat});return Ext.create(d,"datetimepicker")},onTriggerClick:function(){c.DateTimeField.superclass.onTriggerClick.apply(this,arguments);this.menu.primaryPicker.setValue(this.getValue()||new Date())}});Ext.reg("datetimefield",c.DateTimeField)})();