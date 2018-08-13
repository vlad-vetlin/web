
function howManyFieldsAreAlreadyFilled() {
    left = [27, 35, 42, 50, 57, 63, 67, 71, 74, 78, 81, 84, 87, 91]


    var name = document.getElementById('name');
    var photo = document.getElementById('photo');
    var date = document.getElementById('date');
    var phone = document.getElementById('phone');
    var email = document.getElementById('email');
    var social = document.getElementById('social');
    var uni = document.getElementById('uni');
    var course = document.getElementById('course');
    var status = document.getElementById('status');
    var address1 = document.getElementById('address1');
    var address2 = document.getElementById('address2');
    var org = document.getElementById('org');
    var hobbies = document.getElementById('hobbies');

    var counter = 0;

    if (name.value != "")
        counter++
    if (photo.value != "")
        counter++
    if (date.value != "")
        counter++
    if (phone.value != "")
        counter++
    if (email.value != "")
        counter++
    if (social.value != "")
        counter++
    if (uni.value != "")
        counter++
    if (course.value != "")
        counter++
    if (status.value != "")
        counter++
    if (address1.value != "")
        counter++
    if (address2.value != "")
        counter++
    if (org.value != "")
        counter++
    if (hobbies.value != "")
        counter++

    var ball = document.getElementById("ball");
    ball.style.webkitAnimationName = "jumping" + counter.toString();
    ball.style.webkitAnimationDuration = "0.8s"
    ball.style.marginLeft = left[counter].toString() + "%";
}