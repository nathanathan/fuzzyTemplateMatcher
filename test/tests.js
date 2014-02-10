test( "not too greedy test", function() {
  var match = fuzzyTemplateMatch("This object is a string", "This is a {{object}}");
  ok( match.vars[0].value === "string", "Passed!" );
});

test( "demo test", function() {
  var match = fuzzyTemplateMatch("input a string and this will match variables in the template.",
  "Enter a {{object}}, and it will {{action}}");
  ok( match.vars[0].value === "string", "Passed!" );
  ok( match.vars[1].value === "match variables in the template.", "Passed!" );
});

test( "Empty var test", function() {
  var match = fuzzyTemplateMatch("Location:", "Location: {{location}}");
  ok( match.vars[0].value === "", "Passed!" );
});