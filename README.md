# Twitter Mutual Friends
Find the list of mutual friends of two twitter users using their usernames using Twitter API

> ## Twitter API Rate Limit Note
> Currently, the rate limit set by Twitter is 15 requests per 15 minutes. Since maximum user count returned in a single request is 200, any request where the total count of friends of both the users exceeds 3000 (15*200) will immediately exhaust the rate limit quota! (For e.g. @WebSummit which has 26.4K friends)

# Cases handled
1. Normal case- All the mutual friends are displayed as clickable cards

![GitHub Logo](/screenshots/1.jpg)

2. No mutual friends- Message is displayed  

![GitHub Logo](/screenshots/2.jpg)

3. Rate limit exceeded- Error message is displayed

![GitHub Logo](/screenshots/3.jpg)

4. User not found- Error message is displayed

![GitHub Logo](/screenshots/4.jpg)

5. Some unknown error- Error message is displayed