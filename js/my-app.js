/* GLOBALNE VARIJABLE */

var korisnik, korisnici;

var socket = io(socketServer);

function onLoad() {
	// OVO VRATITI U DEVICEREADY ZA KONAČNU APP!!!
     //  document.addEventListener("deviceready", init, false);
     init();
   }

function init() {
	$.ajaxSetup ({
		cache: false
	});
	$('img.logotip').attr('src',socketServer+'tablet/logotip.png');
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
		$('.profilself').html('<img src="'+socketServer+'/profili/i'+korisnik+'.png">'+socketServer+'/profili/i'+korisnik+'.png');
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
		     $.post( socketServer+'/selfi', {data: imageData, id: korisnik, igrac:igrac}, function(data) {
			  });
		     
		}
		 
		function onFail(message) {
		    alert('Failed because: ' + message);
		}
	});
	$('.submit').click(function(){
		var nick=$('.ime').val();
		$.post( socketServer+'/profil', {id: korisnik, nick:nick, igrac:igrac}, function(data) {
			  });
	});

});

/* SOCKET AKCIJE */

socket.on('selfieupdt', function(msg){
	$('body').append(msg+' '+igrac+'<br>');
	 if(msg==igrac)$('.profilself').html('<img src="'+socketServer+'/profili/i'+korisnik+'.png?v='+Date.now()+'">'+socketServer+'/profili/i'+korisnik+'.png');
});