#Yubi - Device Recognition
This is a device recognition boilerplate. I think it would be cool to use this to standardize sign ins across my sites. Users can be identified and immediately logged in, essentially using the unique browser id as a token.

I looked into Flash Cookies / LSO but all of the examples I could find only worked across domains and not across browsers. The way that I'd think to group browsers to devices would be to have the user give some identifying information, like signing in or submitting an email. Once you get two browsers / devices on one user you can save that data to the db and query with the uid any time a user visits the site. Generally people aren't constantly clearing their localstorage so if their uid ever changes you can use the old uid to lookup the user and update it with the new uid.

Currently it's getting information from the fingerprint2 library, which covers 25 client side data sources, and a hash of the user's IP from the server. A primitive way to check for the same user across browsers would be to compare location hashes and whichever data sources are shared across the browsers, but in my research I found too many differences to leave enough individualized information behind; it's too easy to end up hitting every Macbook in a 5 mile radius.

I want to look into TLS to see if those requests contain any more information.
