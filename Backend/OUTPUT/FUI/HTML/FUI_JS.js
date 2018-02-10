{
document.addEventListener('DOMContentLoaded', function() {

	document.getElementById('id_1').setAttribute('title', 'MainWindow');
	document.getElementById('id_22').innerText = 'Latte';
	document.getElementById('id_21').innerText = 'Mocha';
	document.getElementById('id_20').innerText = 'LatteMacchiato';
	document.getElementById('id_18').setAttribute('name', 'ready');
	document.getElementById('id_18').setAttribute('checked', 'True');
	document.getElementById('id_18').innerText = 'Maybe';
	document.getElementById('id_17').setAttribute('name', 'ready');
	document.getElementById('id_17').innerText = 'No';
	document.getElementById('id_16').setAttribute('name', 'ready');
	document.getElementById('id_16').innerText = 'Yes';
	document.getElementById('id_15').innerText = 'Areyouready';
	document.getElementById('id_13').innerText = 'Hover';
	document.getElementById('id_13').setAttribute('name', 'button1');
	document.getElementById('id_12').setAttribute('name', 'Age');
	document.getElementById('id_11').setAttribute('name', 'Gender');
	document.getElementById('id_11').innerText = 'Female';
	document.getElementById('id_11').setAttribute('name', 'female');
	document.getElementById('id_10').setAttribute('name', 'Gender');
	document.getElementById('id_10').innerText = 'Male';
	document.getElementById('id_10').setAttribute('name', 'male');
	document.getElementById('id_9').innerText = 'Gender';
	document.getElementById('id_8').setAttribute('maxlength', '8');
	document.getElementById('id_8').setAttribute('name', 'pwBox');
	document.getElementById('id_7').setAttribute('name', 'inputBox');
	document.getElementById('id_6').innerText = 'Password';
	document.getElementById('id_5').innerText = 'Username';
	document.getElementById('id_3').innerText = 'WelcometoXAMLUIMigrationExample';

	});


if(document.getElementById('id_13')){
	document.getElementById('id_13').addEventListener('onclick', OnClick1)}; 
function OnClick1(){}
if(document.getElementById('id_12')){
	document.getElementById('id_12').addEventListener('onclick', HandleCheck)}; 
function HandleCheck(){}
if(document.getElementById('id_12')){
	document.getElementById('id_12').addEventListener('onclick', HandleUnchecked)}; 
function HandleUnchecked(){}
if(document.getElementById('id_11')){
	document.getElementById('id_11').addEventListener('onclick', HandleCheck)}; 
function HandleCheck(){}
if(document.getElementById('id_10')){
	document.getElementById('id_10').addEventListener('onclick', HandleCheck)}; 
function HandleCheck(){}
}