/* GLOBALNE VARIJABLE */

var korisnik, korisnici;

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



	/* RESET JAVASCRIPT */

	function resetall(){
		$('.profilself').html('');
		$.getJSON( socketServer+"profili/index.json", function( data ) {
		  $('body').append(data);
		  korisnici=data;
		});
	}

	/* ODABIR JAVASCRIPT */

	$('.novi').click(function(){
		$('#prviizbor').hide();
		$('#profil').show();
		korisnik=Math.ceil(Math.random()*Math.pow(10,16));
	});

	/* PROFIL JAVASCRIPT */
	$('.selfi').click(function(){
		navigator.camera.getPicture(onSuccess, onFail, { 
		    quality: 80,
		    targetWidth: 450,
		    targetHeight: 600,
		    destinationType: Camera.DestinationType.DATA_URL
		});
		 
		function onSuccess(imageData) {
		     $.post( socketServer+'/selfi', {data: imageData, id: korisnik}, function(data) {
			    $('.profilself').html('<img src="'+socketServer+'/profili/i'+korisnik+'.png">'+socketServer+'/profili/i'+korisnik+'.png');
			    setTimeout(function(){ $('.profilself').html('<img src="'+socketServer+'/profili/i'+korisnik+'.png">'+socketServer+'/profili/i'+korisnik+'.png');}, 1000);
			  });
		     
		}
		 
		function onFail(message) {
		    alert('Failed because: ' + message);
		}
	});
});