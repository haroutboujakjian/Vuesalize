(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{372:function(t){t.exports=JSON.parse('[{"date":"2019","Utilities":5921,"Rent":1026,"Insurance":2324},{"date":"2020","Utilities":1539,"Rent":1560,"Insurance":1257},{"date":"2021","Utilities":2457,"Rent":2784,"Insurance":1438},{"date":"2022","Utilities":4980,"Rent":1332,"Insurance":3200},{"date":"2023","Utilities":3980,"Rent":2332,"Insurance":3100}]')},435:function(t,a,e){"use strict";e.r(a);e(64);var n=e(372),i={name:"LineChartExample",props:["annotation"],data:function(){return{plotData:n,margin:{top:20,bottom:30,left:50,right:20},annotations:[{type:"line",axis:"x",color:"#b3080e",label:"Start Date",labeldy:-5,value:new Date(2019,6,0)},{type:"line",axis:"x",color:"#b3080e",label:"End Date",labeldy:-5,value:new Date(2020,9,0)}]}}},s=e(2),l=Object(s.a)(i,(function(){var t=this.$createElement,a=this._self._c||t;return this.annotation?a("LineChart",{attrs:{"plot-data":this.plotData,"x-key":"date",width:450,height:250,margin:this.margin,"x-axis-label":"Year","y-axis-label":"Expenses",annotations:this.annotations,"y-tick-format":function(t){return"$"+t}}}):a("LineChart",{attrs:{"plot-data":this.plotData,"x-key":"date",width:450,height:250,margin:this.margin,"x-axis-label":"Year","y-axis-label":"Expenses","y-tick-format":function(t){return"$"+t}}})}),[],!1,null,"30f532ae",null);a.default=l.exports}}]);