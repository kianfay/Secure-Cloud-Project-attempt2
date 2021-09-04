# Secure-Cloud-Project college project
A cloud based file storage web-app, using asymmetric encryption to share files between groups of users.

## Write up
Firstly, for my design I wanted to be able to access a public google drive folder, which conflicts with
the common drive API approach which first requires OAuth login before access is granted. So
instead, I managed to find a less common google API which allowed me to get a listing of the public
folder and even download files. So first I make a public folder. To do this we made a directory
‘Secure Cloud Public Directory’, and set it to unlisted, where anyone with the link can access it.
I then created Cloud Project under Googles ‘Google Cloud Platform’. The key granted was:
AIzaSyDvvV7UdBteW-MCcyCE5XapxnlVdO4hD90. This key needs to be included in any of the API
request to Google Drive.

So next I set up a backbone, consisting of a React frontend, and an Express backend, all running
through Node.js. I wanted an extra layer of public key/symmetric key security between the back and
frontend, so I set up a TLS connection for my backend. This would ensure that when in development,
a real user would be able to securely communicate with the backend. I installed the certificate by
installing a Windows version of Linux’s OpenSSL application. Then, as we are in development and
cannot use a CA to certify the localhost domain, I tweaked Chrome to accept my certificate as a root
CA.

As for the science behind the security, the backend provides a store of public keys, where once a
name-public key pair has been added, it cannot be removed or tampered with. Thus, any user who
wishes to include other users in their group simply uses their public key to encrypt the shared
symmetric key (I used AES because it is the standard, and RSA because I understood it). They then
bundle these encrypted keys together and store them at the backend. From now on, any of the
users in the group can download the group file, decrypt the shared key using their private keys, and
access any shared files. The symmetric key used is randomly generated at the frontend, with a
secure third-party library.

Uploading required an OAuth authentication, which I was adamant on not enforcing on the user, so I
set up an authenticated connection on the backend, whereby a user sends the already encrypted file
to, to be uploaded to Google Drive.

The ‘modify groups’ feature is obviously missing, although the method I planned to use is sound. By
allowing anyone to ‘try’ to change a group, whereby, a user fetches a group object, edits the people
who have access, by simply removing people or encrypting the shared key with new users’ public
keys. Of course, only an already authorized member could add people successfully, but anyone
would be able to change and reupload it maliciously, messing up the group system. So, as we want
this access restricted to the admin, the admin would change the group members, encrypt the group
object with his private key, send it to the backend, and then the backend would decrypt it using the
admins private key. In this request, the admin would state their name, allowing the backend to fetch
the public key, decrypt it, see if the group’s adminName property was the same as the name sent
through, as well as check if the admin included an integrity header, and only then override the old
group with this new group. The problem with this was that the asymmetric library I was using
required the recipients public key and the senders private key, which was not easily possible. A
solution could have been to have the backend send over the SSL certificates public key, but I had too
little time unfortunately.
