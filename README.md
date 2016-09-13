#Yubi - Device Recognition

This is a device recognition boilerplate. I think it would be cool to use this to standardize sign ins across my sites. Users can be identified and immediately logged in, essentially using the unique browser id as a token.

##Hypothesis

The way that I've come up with to group browsers to devices is to have the user give some identifying information by signing in. Once I get two browsers / devices on one user I save that data to the db and query with the uid any time a user visits the site.

##Process

Currently it's getting information from the fingerprint2 library, which covers 25 client side data sources. I'm also getting a hash of the user's IP from the websocket server. I implemented the user login system, and added a way to view and edit all of the fingerprints associated with your account in the sidebar.

##Alternatives

A primitive way to check for the same user across browsers would be to compare location hashes and whichever data sources are shared across the browsers, but in my research I found too many differences to leave enough individualized information behind; it's too easy to end up hitting every Macbook in a 5 mile radius, and tying the uid to ip means if you go anywhere else the id will change, which is not ideal.

I looked into Flash Cookies / LSO but all of the examples I could find only worked across domains and not across browsers. I also want to look into TLS to see if https requests contain any more information, but I prioritized getting the functionality I wanted completed first.
