module.exports = {
	//removes common words from array
	stripWords: function (array) {
		var newArray = [];

		for (idx in array) {
			var word = array[idx];
			if (!this.isStripped(word)) {
				newArray.push(word.toLowerCase());
			}
		}

		return newArray;
	},

	//checks if word is in the strippedwords array
	isStripped: function (word) {
		var strippedWords = ['the', 'a', 'of', 'from', 'on', 'which', 'and', 'was', 'him', 'he', 'up', 'down', 'out', 'you', 'about', 'then', 'his', 'toward', 'towards', 'in', 'top', 'at', 'its', 'like', 'as', 'because', 'under', 'an', 'that', 'those', 'these', 'to', 'said', 'this', 'is', 'yours', 'here', 'there', 'with', 'will', 'do', 'off', 'over', 'it', 'went', 'himself', 'too', 'but', 'has', 'hasnt', 'not', 'if', 'i', 'we', 'your', 'above', 'across', 'again', 'against', 'almost', 'along', 'also', 'around', 'are', 'am', 'another', 'any', 'been', 'be', 'back', 'away', 'before', 'behind', 'being', 'best', 'by', 'can', 'for', 'my', 'must', 'or', 'other', 'are', 'who', 'why', 'when', 'where', 'while', 'all', 'did', 'dont', 'had', 'go', 'get', 'im', 'into', 'after', 'could', 'her', 'have', 'me', 'no', 'now', 'says', 'mr', 'she', 'so', 'thier', 'them', 'they', 'were', 'what', 'some', 'would', 'always', 'among', 'us', 'even', 'ever', 'than', 'their', 'upon', 'very', 'how', 'say', 'hes', 'only', 'o', 'mrs', 'ours', 'through'];

		return (strippedWords.indexOf(word.toLowerCase()) > -1);
	},

	//dynamically transforms the array of words into an object with count
	wordsObject: function (array) {
		var listObject = {};

		for (idx in array) {
			var word = array[idx];

			if (listObject[word]) {
				listObject[word] += 1;
			} else {
				listObject[word] = 1;
			}
		}

		return listObject;
	},

	//strips all but the most used words
	topWords: function (object, cutoff) {
		var newObject = {};

		for (word in object) {
			//Change the number here for cutoff
			if (object[word] > cutoff) {
				newObject[word] = object[word];
			}
		}

		return newObject;
	}
}
