# User Stories — Varal

Derived from [lean-canvas.md](./lean-canvas.md). Each story is a minimal
testable slice of work. Stories are grouped by feature and ordered roughly by
priority within each group.

---

## Feature: Wash Forecast

| # | Story | Tasks |
|---|-------|-------|
| 1 | As a user, I want to receive a recommendation that distinguishes between types of clothes — not just a single YES/NO — so that I can decide what goes in the machine rather than whether to do laundry at all. | design, front-end, back-end, weather research |
| 2 | As a user, I want the app to detect my location automatically so that I get a recommendation without typing anything. | front-end, back-end |
| 3 | As a user, I want to enter my location manually (CEP / postal code) so that I can get a recommendation when GPS is unavailable or inaccurate. | front-end, back-end |
| 4 | As a user, I want to describe my drying setup (open yard, south-facing balcony, covered balcony, indoor with window, no outdoor space) so that the recommendation accounts for how much sun, wind, and airflow I actually have access to. | design, front-end, back-end, weather research |
| 5 | As a user, I want to select the types of clothes I'm planning to wash (e.g. bed sheets, heavy knitwear, light cotton, delicates) so that the recommendation tells me whether those specific items will dry before conditions change. | design, front-end, back-end, weather research |
| 6 | As a user, I want to set the time window during which my clothes can hang (e.g. 9am–7pm) so that the app only recommends washing if the clothes will be dry before I need to bring them in. | design, front-end, back-end, weather research |
| 7 | As a user, I want to see the recommendation for the next few days so that I can plan when to do laundry this week. | front-end, back-end |
| 8 | As a user, I want to see an hourly drying timeline that reflects my setup and what I'm washing so that I know the best window to hang each type of item. | design, front-end, back-end, weather research |
| 9 | As a user, I want to see which weather factors influenced the recommendation (rain probability, wind speed, wind direction, temperature, humidity, UV index) so that I understand why conditions are or aren't suitable. | design, front-end, back-end, weather research |
| 10 | As a user, I want to see how confident the recommendation is so that I can decide whether to take the risk on borderline days. | design, front-end, back-end, weather research |
| 11 | As a user, I want to know the estimated drying time per item type in today's conditions so that I know whether my specific load will be ready in time. | design, front-end, back-end, weather research |
| 12 | As a user, I want to receive a push notification on good laundry days so that I don't miss the opportunity. | front-end, back-end |
| 13 | As a user, I want to set my preferred laundry days so that notifications are only sent on days I actually plan to wash. | design, front-end, back-end |
| 14 | As a user, I want to share the day's recommendation via a link or image so that I can send it to family or roommates. | design, front-end |

## Feature: Fabric & Garment Awareness

| # | Story | Tasks |
|---|-------|-------|
| 15 | As a user, I want the recommendation to distinguish between fabric types (e.g. "great for cotton, skip the wool today") so that I can prioritize what to wash first on partial-weather days. | design, front-end, back-end, weather research |
| 16 | As a user, I want to see how different fabrics and item types compare in today's conditions so that I can make the most of a limited drying window. | design, front-end, back-end, weather research |
| 17 | As a user, I want to be warned when conditions could damage delicate fabrics (strong wind, intense UV, high humidity) so that I protect items that need gentle treatment. | design, front-end, back-end, weather research |

## Feature: Label Decoder

| # | Story | Tasks |
|---|-------|-------|
| 18 | As a user, I want to look up a clothing care symbol and see a plain-language explanation so that I understand what the icons on my labels mean. | design, front-end, back-end |
| 19 | As a user, I want to browse all common care symbols in a visual reference so that I can learn them over time. | design, front-end |
| 20 | As a user, I want to scan a clothing label with my phone camera and have the symbols identified automatically so that I get answers faster. | design, front-end, back-end |
| 21 | As a user, I want to see the full care instructions for a garment after scanning its label so that I know how to wash, dry, and iron it correctly. | design, front-end, back-end |

## Feature: Laundry Knowledge Base

| # | Story | Tasks |
|---|-------|-------|
| 22 | As a user, I want to know the difference between powder and liquid detergent so that I pick the right one for my laundry. | design, front-end, back-end |
| 23 | As a user, I want to learn how to sort my clothes before washing so that I avoid damaging or discoloring them. | design, front-end, back-end |
| 24 | As a user, I want to know the correct water temperature for each fabric type so that I don't shrink or damage my clothes. | design, front-end, back-end |
| 25 | As a user, I want to know how often I should wash different types of garments so that I don't over-wash or under-wash them. | design, front-end, back-end |
| 26 | As a user, I want stain removal tips for common stains (coffee, grease, wine) so that I can treat them before they set. | design, front-end, back-end |
| 27 | As a user, I want to know when and why to use a laundry bag so that I protect delicate items in the machine. | design, front-end, back-end |
| 28 | As a user, I want to know which products to avoid on certain fabrics (e.g., bleach on silk) so that I don't ruin my clothes. | design, front-end, back-end |
| 29 | As a user, I want to search the knowledge base by topic or keyword so that I find answers quickly. | design, front-end, back-end |
| 30 | As a user, I want to see contextual laundry tips alongside the wash forecast so that I learn while I use the app. | design, front-end, back-end |

## Feature: User Experience & Accessibility

| # | Story | Tasks |
|---|-------|-------|
| 31 | As a user, I want the app to load fast on a mobile connection so that I can check the recommendation quickly. | front-end |
| 32 | As a user, I want to install the app on my home screen (PWA) so that it feels like a native app. | front-end |
| 33 | As a user, I want to use the app without creating an account so that I get value instantly with zero friction. | |
| 34 | As a user, I want the app to remember my last-used location and preferences so that I don't have to set them every time I visit. | front-end |
| 35 | As a user, I want to see the app in my language (starting with Portuguese) so that I can understand everything clearly. | front-end, back-end |
| 36 | As a user, I want the app to be usable with a screen reader so that it is accessible regardless of my abilities. | design, front-end |
| 37 | As a user, I want to use the app offline with the last fetched recommendation cached so that I have something useful even without internet. | front-end |

## Feature: Feedback & Accuracy

| # | Story | Tasks |
|---|-------|-------|
| 38 | As a user, I want to report whether the recommendation was accurate ("Was this right?") so that the app can improve over time. | design, front-end, back-end |
| 39 | As a user, I want to see the app's overall accuracy score so that I know how much to trust it. | design, front-end, back-end |

## Feature: Monetization

| # | Story | Tasks |
|---|-------|-------|
| 40 | As a free user, I want to use the core wash recommendation for free (with ads) so that I get value without paying. | design, front-end, back-end |
| 41 | As a user, I want to subscribe to a paid plan (monthly/yearly/lifetime) so that I can remove ads. | design, front-end, back-end |
| 42 | As a paying user, I want access to premium features (multi-day forecast, fabric advice, custom alerts) so that I get extra value from my subscription. | front-end, back-end |
| 43 | As a paying user, I want to manage or cancel my subscription easily so that I stay in control of my spending. | design, front-end, back-end |

## Feature: Social & Sharing

| # | Story | Tasks |
|---|-------|-------|
| 44 | As a user, I want to share the app with friends via a simple link so that they can also benefit from it. | front-end |
| 45 | As a user, I want to see a fun, shareable summary of my laundry habits (e.g., "You washed 12 times this month") so that I can post it on social media. | design, front-end, back-end |

## Feature: Drying Session Tracker (Backoffice)

| # | Story | Tasks |
|---|-------|-------|
| 46 | As a Laundry Expert, I want to start a drying session by selecting clothing weight categories so that I can track each type independently. | front-end, back-end |
| 47 | As a Laundry Expert, I want the app to automatically record weather conditions every 15 minutes during a session from multiple sources so that I have accurate environmental data for each session. | back-end, weather research |
| 48 | As a Laundry Expert, I want to see a per-category elapsed timer so that I know how long each type of clothes has been drying. | front-end |
| 49 | As a Laundry Expert, I want to receive a browser notification every 30 minutes asking whether clothes have dried so that I don't forget to end the session. | front-end |
| 50 | As a Laundry Expert, I want to mark individual categories as dried at any point during the session so that I record the precise drying time for each weight class. | front-end, back-end |
| 51 | As a Laundry Expert, I want to end a session and indicate whether I collected the clothes just now or earlier (with a time picker) so that the recorded drying duration is as accurate as possible. | front-end, back-end |
| 52 | As a Laundry Expert, I want sessions to survive a page refresh so that an accidental reload doesn't lose tracking state. | front-end |
