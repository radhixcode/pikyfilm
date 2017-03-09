var imageFormatOk;
var imageSizeOk;

//Function to display the image.
function readFile(input) {

    // If the input is a file. Set path to the src of image tag id for displaying image. 
    if (input.files && input.files[0]) {

        var reader = new FileReader();
        
        reader.onload = function () {
            $('#image').attr('src', reader.result);         
        }        
        reader.readAsDataURL(input.files[0]);
    }
}

// While uploading the image.
$("#input-picture").change(function(){

	$('.message').removeClass("error").html("Format (.jpg, .png, .jpeg, .gif, .bmp) | Size max 2MB");
    
    // Get the file name and take the format (letters after '.') and convert to uppercase   
    var imageName = $("#input-picture").val();
    var extension = imageName.split('.').pop().toUpperCase();

    //If the format is not PNG JPG or JPEG and file name is empty throw an error message
    if((imageName.length < 1)||(extension!="PNG" && extension!="JPG" && extension!="JPEG" && extension!="GIF" && extension!="BMP")) {
        imageFormatOk = 0;
        $('.message').addClass("error").html("Image format should be in PNG, JPG, JPEG, GIF or BMP");
    }
    //If image in desired format check the size.
    else {
        imageFormatOk = 1;

        // If size is below 2MB (2e+6MB) call function to read the file, else throw error message.
        if ((this.files[0].size)<2e+6) {
        	imageSizeOk = 1;
        	readFile(this);        	
        }else{
        	imageSizeOk = 0;
        	$('.message').addClass("error").html("Size should be less than 2MB");
        }  
    }

});

// When click submit button sent the image for further functions
$("#submit-pic").on("click", function(event){
	
	event.preventDefault();

	var imageName = $("#input-picture").val();

    //If the image selected and in correct format and size then submit the form.
	if(imageName){	
	    if(imageFormatOk === 1 && imageSizeOk === 1) {
	        $('.message').removeClass("error").html("Sending...");
	        // $("#image-form").submit();
	    }
    }else{
    	$('.message').addClass("error").html("Upload an image");
    }

});