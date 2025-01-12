
# trie-fs

Create amazing tries storaged in files using File System, to avoid using an excessive amount of memory to store long tries.


## Installation

Install `trie-fs` by simply using

```bash
  npm install trie-fs
```


    
## Usage/Examples

```javascript
import Trie from "trie-fs"

//run all operations in async environments
async function fn() {

        const trie = new Trie()
        //to set up the trie use trie.init(dir,groups)
        // dir = folder of the trie
        // groups = amount of chars per subfolder of the trie
        await trie.init("trie", 1)

        //if you are going to add, search or delete the same word/s over and over again, you can use makePath to avoid formatting the same word/s each time you call any function
        const path = trie.makePath("abcde")

        //to add words to the trie, use trie.add(word, receivedPath)
        // word = the word (or path created by makePath)
        // receivedPath = only set to true when the 'word' arg is a path created by using makePath
        await trie.add(path,true)
        await trie.add("abxde")

        //to search a word, use trie.search(word, receivedPath)
        // word = the word (or path created by makePath)
        // receivedPath = only set to true when the 'word' arg is a path created by using makePath
        const result1 = await trie.search(path,true)
        const result2 = await trie.search("abxde")
        const result3 = await trie.search("unexistent_word")

        console.log(result1)
        //OUTPUT: ["/path/to/folder/", ["inner","files"]]
        console.log(result2)
        //OUTPUT: ["/path/to/folder/", ["inner","files"]]
        console.log(result3)
        //OUTPUT: [null,null]

        //to delete words from the trie, use trie.delete(word)
        //note that this function cannot receive paths built by makePath
        //this is the most costful function, try to avoid it if possible.
        await trie.delete("abcde")

}

fn()
```


## License

[MIT](https://choosealicense.com/licenses/mit/)

