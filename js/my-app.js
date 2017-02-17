var socket = io(socketServer);

function onLoad() {
       document.addEventListener("deviceready", init, false);
   }

function init() {
	$.ajaxSetup ({
		cache: false
	});
}

$(function(){
	$('.selfi').click(function(){
		navigator.camera.getPicture(onSuccess, onFail, { 
		    quality: 20,
		    destinationType: Camera.DestinationType.DATA_URL
		});
		 
		function onSuccess(imageData) {
		     $.post( socketServer+'/selfi', {data: imageData}, function(data) {
			    alert("Image uploaded!");
			  });
		}
		 
		function onFail(message) {
		    alert('Failed because: ' + message);
		}
	});
});