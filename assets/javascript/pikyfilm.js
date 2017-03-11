var imageFormatOk;
var imageSizeOk;

// Initialize Firebase
var config = {
    apiKey: "AIzaSyAMc3QdtNtFggkRn5pMeE5ddn3XB-1Mhe4",
    authDomain: "pikyfilm-db-1488918750397.firebaseapp.com",
    databaseURL: "https://pikyfilm-db-1488918750397.firebaseio.com",
    storageBucket: "pikyfilm-db-1488918750397.appspot.com",
    messagingSenderId: "313537021654"
};

firebase.initializeApp(config);

//Function to display the image.
function readFile(input) {

    // If the input is a file. 
    if (input.files && input.files[0]) {

        // Read file. Set path to the src of image tag id for displaying image. 
        var reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
        
        reader.onload = function (event) {
            $('#image').attr('src', event.target.result);         
        }               
    }
}

// Function to convert image data to blob.
var makeBlob = function (dataURL) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
        var parts = dataURL.split(',');
        var contentType = parts[0].split(':')[1];
        var raw = decodeURIComponent(parts[1]);
        return new Blob([raw], { type: contentType });
    }
    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
}


// Yousra elbanna & minhtuyenmai
//function to send the picture to the Face api and return age
function Face2Age(imageDataBlob){
   
 var params = {
      "returnFaceId": "true",
      "returnFaceAttributes": "age",
  };
    $.ajax({
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        "Ocp-Apim-Subscription-Key": "0ef6103744a14f9591f2708a965373b3"
      },
      url: "https://westus.api.cognitive.microsoft.com/face/v1.0/detect?" + $.param(params),
      processData:false,
      data: imageDataBlob

    }).done(function(response) {

      if(response.length > 0){

        //Scroll down to the resul section.
        $('html, body').animate({
            scrollTop: $("#result-section").offset().top
        });

        console.log("Number of faces :" + response.length);
        var age = response["0"].faceAttributes.age;
            $("#age-display").html("Your age is :" + age);
        Age2Year(age);
        // for(var j=0; j<response.length; j++){
        //     var age[j] = response["j"].faceAttributes.age;
        //     $("#age-display").html("Your age is :" + age[j]);
        // }
        
        }
      else{
        $('.message').addClass("error").html("No faces detected");
      }         

    }).fail(function() {
       alert("error");            
    });
  
  }


//Yousra Elbanna
//function to get year of birth given age
function Age2Year(photoage) {
    
    var date= new Date();
    var currentYear = date.getFullYear();
    var age1 = Math.floor(photoage);
    var birthYear= currentYear - age1;
    $("#birth-year").html("Your Birth Year is: " + birthYear);
    movieQuery(birthYear);
}


// Erin Glabe
// function to take the birth year and request movies from that year
function movieQuery(year) {

    // url for tmdb api that requests the top movies from a year -- inserts the given year
    var tmdbURL = "https://api.themoviedb.org/3/discover/movie?primary_release_year=" + year + "&page=1&include_video=false&include_adult=false&sort_by=popularity.desc&language=en-US&api_key=bc03fb2028c35ec867a969e54345b8a6";
    // we will use a movie counter to keep track of which response we are on
    var movieCounter = 0;

    // ajax call #1 to get the main information
    $.ajax({
        url: tmdbURL,
        method: "GET"
    }).done(function(tmdbData) {

        // ajax call #2 needed to retrieve movie poster base url, not given in first request
        $.ajax({
            url: "https://api.themoviedb.org/3/configuration?api_key=bc03fb2028c35ec867a969e54345b8a6",
            method: "GET"
        }).done(function(tmdbIMG){

            // loops through the five responses that we want
            for (var i = 0; i < 6; i++) {

                // value used from movie div ids
                movieCounter++;

                // creates a div, names it based on the movieCounter value, appends it into the html
                var movie = $("<div>")
                movie.addClass("movie-div text-left");
                movie.attr("id", "movie-num-" + movieCounter);
                $("#movie-display").append(movie);

                // check if the response.doc[i] object exists
                if(tmdbData.results[i] !== undefined){  

                    // If there is a title... appends it to the appropriate div
                    if (tmdbData.results[i].title !== null) {
                        $("#movie-num-" + movieCounter)
                            .append("<h3 class='movie-title'>" + tmdbData.results[i].title + "</h3>");
                    }

                    // If there is a movie poster... appends it to the appropriate div
                    if (tmdbData.results[i].poster_path !== null) {
                        $("#movie-num-" + movieCounter)
                            // the base url and size data are pulled from the second ajax request
                            .append("<img class='pull-left movie-image' src=" + tmdbIMG.images.base_url + "w185" + tmdbData.results[i].poster_path + ">");
                    }

                    // If there is a release date... appends it to the appropriate div
                    if (tmdbData.results[i].release_date !== null) {
                        var convertedDate = moment(tmdbData.results[i].release_date).format("MMM DD, YYYY");
                        $("#movie-num-" + movieCounter)
                            .append("<p><strong>Release Date: </strong>" + convertedDate + "</p>");
                    } 

                    // If there is an overview... appends it to the appropriate div
                    if (tmdbData.results[i].overview !== null) {
                        $("#movie-num-" + movieCounter)
                            .append("<p><strong>Overview : </strong>" + tmdbData.results[i].overview + "</p>");
                    }                                         
                }  
                            
            }

        });

    }); 

}

//Yousra Elbanna
//function using ip-api to capture user ip and return city & country
function getip(){
    var IpQueryUrl = "http://ip-api.com/json";
    $.ajax({
        url: IpQueryUrl,
        method: "GET"
    }).done(function(response) {
        var city = response.city;
        var country = response.country;
        console.log(city);
        console.log(country);
        send2database(city,country);
    });
}

//Yousra Elbanna
//We pass the city& country of user to this function to push in firebase database
function send2database(userCity,userCountry){

    // Create a variable to reference the database
    var userdata = firebase.database();
    userdata.ref().push({
        city: userCity,
        country: userCountry
    });
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

    //Empty result display section
    $("#movie-display").empty();
    $("#age-display").empty();
    $("#birth-year").empty();

    var imageName = $("#input-picture").val();

    //If the image selected and in correct format and size.
    if(imageName){  
        if(imageFormatOk === 1 && imageSizeOk === 1) {
            $('.message').removeClass("error").html("Sending...");
            
            //Get uploaded file attributes and read the content of file
            var input = $("#input-picture")[0].files[0];
            var reader = new FileReader();
            reader.readAsDataURL(input);
            
            reader.onload = function (event) {

                //Get image data, convert to blob
                var imageData = event.target.result; 
                var imageBlob = makeBlob(imageData);

                //  Call function for API call with this argument
                Face2Age(imageBlob);
                getip();     
            }
        }
    }else{
        $('.message').addClass("error").html("Upload an image");
    }
});
