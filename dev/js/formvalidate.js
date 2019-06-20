import Pristine from 'pristinejs';

let config = {
    classTo: 'form-group',
    errorClass: 'form-error',
    successClass: 'has-success',
    errorTextParent: 'form-group',
    errorTextTag: 'div',
    errorTextClass: 'form-error-text'
};

window.onload = function () {

    var form = document.getElementById("form");

    var pristine = new Pristine(form, config);

    form.addEventListener('submit', function (e) {

        var valid = pristine.validate();
        if (valid) {
            return true;
        } else {
            e.preventDefault();
        }
    });
};