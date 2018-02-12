{
document.addEventListener('DOMContentLoaded', function() {

	document.getElementById('id_1').setAttribute('title', 'MainWindow');
	document.getElementById('id_20').innerText = 'Latte';
	document.getElementById('id_19').innerText = 'Mocha';
	document.getElementById('id_18').innerText = 'LatteMacchiato';
	document.getElementById('id_16').setAttribute('name', 'ready');
	document.getElementById('id_16').setAttribute('checked', 'True');
	document.getElementById('id_16').innerText = 'Maybe';
	document.getElementById('id_15').setAttribute('name', 'ready');
	document.getElementById('id_15').innerText = 'No';
	document.getElementById('id_14').setAttribute('name', 'ready');
	document.getElementById('id_14').innerText = 'Yes';
	document.getElementById('id_13').innerText = 'Areyouready';
	document.getElementById('id_11').innerText = 'Hover';
	document.getElementById('id_11').setAttribute('name', 'button1');
	document.getElementById('id_10').setAttribute('name', 'Age');
	document.getElementById('id_9').setAttribute('name', 'Gender');
	document.getElementById('id_9').innerText = 'Female';
	document.getElementById('id_9').setAttribute('name', 'female');
	document.getElementById('id_8').setAttribute('name', 'Gender');
	document.getElementById('id_8').innerText = 'Male';
	document.getElementById('id_8').setAttribute('name', 'male');
	document.getElementById('id_7').innerText = 'Gender';
	document.getElementById('id_6').setAttribute('maxlength', '8');
	document.getElementById('id_6').setAttribute('name', 'pwBox');
	document.getElementById('id_5').innerText = 'Password';
	document.getElementById('id_3').innerText = 'WelcometoXAMLUIMigrationExample';

	});


if(document.getElementById('id_11')){
	document.getElementById('id_11').addEventListener('onclick', OnClick1)}; 
function OnClick1(){}
if(document.getElementById('id_10')){
	document.getElementById('id_10').addEventListener('onclick', HandleCheck)}; 
function HandleCheck(){}
if(document.getElementById('id_10')){
	document.getElementById('id_10').addEventListener('onclick', HandleUnchecked)}; 
function HandleUnchecked(){}
if(document.getElementById('id_9')){
	document.getElementById('id_9').addEventListener('onclick', HandleCheck)}; 
function HandleCheck(){}
if(document.getElementById('id_8')){
	document.getElementById('id_8').addEventListener('onclick', HandleCheck)}; 
function HandleCheck(){}
}