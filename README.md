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

Matches inside {{varialbles}} have a cost of .99.
The idea is to make it so the algorithm matches text to a variable
only if it doesn't match anything outside of the variable.
Making the cost less than one provides an incentive to match text to variables rather than removing it,
while keeping the cost high prevents overly greedy matches.
Here is a example that illustrates the problems with greedy matches:

Imagine matching `This is a {{object}}` with `This object is a string`.
If there is no cost to placing text in a variable, it is cheaper to make the match
`This {{object is a string}}` than `This object is a {{string}}`

However, I think that this is a hacky way of avoiding greedy matches and
that it makes more sence for characters matched with a zero to have no cost.
The added cost of characters in variables obscures the actual Levenschtein
distance. If you want to only accept matches within a certain threshold LD,
the added cost will bias you against otherwise perfect matches that just
happen to contain large variables. For this reason, matches also have am
`adjustedLd` property that is the ld with the cost of variables subtracted from it.


I've modified the Levenshtein algorithm to remove substitutions.
This is because it will cause characters near variables, such as commas,
to be substituted with characters that should be in the variable rather than
removed if they are missing from the input string.

Ambiguity needs to be keep in mind when working with this code.
The simplest example of an ambiguous template is `{{A}}{{B}}`.

Wishlist:
---------
Providing a way to specify types in template expressions, for example
`{{name|length(2,30)}} is {{age|number}} years old.`
would make it possible to match more accurately, and it would make it possible
to generate interfaces from templates that include validation and specialized controls.
