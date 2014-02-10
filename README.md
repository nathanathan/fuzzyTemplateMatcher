fuzzyTemplateMatcher
====================

Parses strings with typos using {{templates}}

[Demo](http://nathanathan.github.io/fuzzyTemplateMatcher)

Details:
--------

Fuzzy template matcher uses an algorithm based on the
[Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance)
algorithm to do fuzzy matching. 
This code could probably be optimized quite a bit. There may be a way to do this
O(m (1 + d)) time (where m is the string or template length and d is the Levenshtein distance),
as that is the best time complexity for computing Lev distance.

Adding characters inside {{varialbles}} has a cost of .99 rather than one.
The idea is to make it so the algorithm include a matches some text to a variable
only if it doesn't match anything outside of the variable.
Making the cost less than one provides an incentive to match text to variables,
but keeping the cost high prevents overly greedy matches.
Here is a example that illustrates the problems with greedy matches:

Images matching `This is a {{object}}` with `This object is a string`.
If there is no cost to placing text in a variable, it is cheaper to make the match
`This {{object is a string}}` than `This object is a {{string}}`

Ambiguity needs to be keep in mind when working with this code.
The simplest example of an ambiguous template is `{{A}}{{B}}`.

Wishlist:
---------
Providing a way to specify types in template expressions, for example
`{{name|length(2,30)}} is {{age|number}} years old.`
would make it possible to match more accurately, and it would make it possible
to generate interfaces from templates that include validation and specialized controls.