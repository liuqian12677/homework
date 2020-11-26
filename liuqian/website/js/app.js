var CalculateGpa;
(function (CalculateGpa) {
    function isNullOrWhitespace(text) {
        if(text == undefined) {
            return true;
        }
        if(text == null) {
            return true;
        }
        if(text.trim().length == 0) {
            return true;
        }
        return false;
    }
    var Entry = (function () {
        function Entry() {
            this.Course = new ko.observable();
            this.CreditHours = new ko.observable();
            this.Grade = new ko.observable();
        }
        Entry.prototype.GradeNumber = function () {
            switch(this.Grade()) {
                case undefined:
                    return 0.0;
                case "A":
                    return 4.0;
                case "A-":
                    return 3.7;
                case "B+":
                    return 3.33;
                case "B":
                    return 3.0;
                case "B-":
                    return 2.7;
                case "C+":
                    return 2.3;
                case "C":
                    return 2.0;
                case "C-":
                    return 1.7;
                case "D+":
                    return 1.3;
                case "D":
                    return 1.0;
                case "D-":
                    return 0.7;
                case "F":
                    return 0;
                case "P":
                    return 0;
                case "NP":
                    return 0;
                case "I":
                    return 0;
                case "W":
                    return 0;
            }
        };
        Entry.prototype.IsCounted = function () {
            switch(this.Grade()) {
                case "A":
                case "A-":
                case "B+":
                case "B":
                case "B-":
                case "C+":
                case "C":
                case "C-":
                case "D+":
                case "D":
                case "D-":
                case "F":
                    return true;
                case undefined:
                case "P":
                case "NP":
                case "I":
                case "W":
                    return false;
            }
        };
        return Entry;
    })();
    CalculateGpa.Entry = Entry;    
    var App = (function () {
        function App() {
            this.Entries = new ko.observableArray();
            this.Modal = new Modal();
            this.Entries.push(new Entry());
            this.Entries.push(new Entry());
        }
        App.prototype.CalculateGpa = function () {
            ga("send", "event", "Calculate Gpa", "Clicked Calculate Gpa button");
            var totalCreditHours = 0;
            var totalGradeNumber = 0;
            var entries = this.Entries();
            for(var i = 0; i < entries.length; i++) {
                var entry = entries[i];
                if(entry.IsCounted()) {
                    var creditHours = parseFloat(entry.CreditHours());
                    totalCreditHours += creditHours;
                    totalGradeNumber += (entry.GradeNumber() * creditHours);
                }
            }
            var gpa = totalGradeNumber / totalCreditHours;
            gpa = Math.round(gpa * 100) / 100;
            var gpaString = "";
            if(gpa.toFixed) {
                gpaString = gpa.toFixed(2);
            } else {
                gpaString = gpa.toString();
            }
            this.Modal.show("Your GPA is: <span style='font-size:150%;'>" + gpaString + "</span>", "Your GPA is...");
        };
        App.prototype.AddMore = function () {
            ga("send", "event", "Calculate Gpa", "Clicked Add More button");
            this.Entries.push(new Entry());
            setTimeout(function () {
                $(".entry .course-textbox").last().focus();
            }, 1000);
        };
        return App;
    })();
    CalculateGpa.App = App;    
    var Modal = (function () {
        function Modal() {
            this.Title = new ko.observable();
            this.Message = new ko.observable();
        }
        Modal.prototype.show = function (message, title) {
            this.Title(title);
            this.Message(message);
            $("#Modal").modal();
        };
        Modal.prototype.onClosed = function () {
            $("#controlBirthdateTextBox").focus();
        };
        return Modal;
    })();
    CalculateGpa.Modal = Modal;    
})(CalculateGpa || (CalculateGpa = {}));
window.onerror = function (message, file, line) {
    ga("send", "event", "Calculate Gpa", "Exception", "window.onerror - file: " + file + "; line:" + line + "; error message: " + message);
};
$(function () {
    var app = new CalculateGpa.App();
    ko.applyBindings(app);
    setTimeout(function () {
        $(".entry .course-textbox").first().focus();
    }, 500);
    $("#Modal").on("hidden", function () {
        app.Modal.onClosed();
    });
});
