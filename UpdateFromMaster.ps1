# ensure we are in the root folder
cd $(git rev-parse --show-toplevel)

# fetch the key files from master
git checkout master -- TypeScriptTetris/app.css TypeScriptTetris/app.js TypeScriptTetris/index.html LICENSE README.md

# move files into correct folder
Move-Item TypeScriptTetris/app.css .\app.css -Force 
Move-Item TypeScriptTetris/app.js .\app.js -Force 
Move-Item TypeScriptTetris/index.html .\index.html -Force

# Remove the now empty TypeScriptTetris directory if it exists 
Remove-Item TypeScriptTetris -Recurse -Force

# Commit these changes
git commit -am "Update gh-pages from master"
# Push the changes to the remote gh-pages branch 
git push origin gh-pages