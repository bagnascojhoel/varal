# User Stories — Varal

Derived from [lean-canvas.md](./lean-canvas.md). Each story is a minimal
testable slice of work. Stories are grouped by feature and ordered roughly by
priority within each group.

---

## Feature: Wash Forecast

| # | Story |
|---|-------|
| 1 | As a user, I want to see a clear YES/NO recommendation for washing clothes today so that I don't have to interpret raw weather data myself. |
| 2 | As a user, I want the app to detect my location automatically so that I get a recommendation without typing anything. |
| 3 | As a user, I want to enter my location manually (CEP / postal code) so that I can get a recommendation when GPS is unavailable or inaccurate. |
| 4 | As a user, I want to see the recommendation for the next few days so that I can plan when to do laundry this week. |
| 5 | As a user, I want to see an hourly drying timeline for the day so that I know the best window to hang my clothes. |
| 6 | As a user, I want to see which weather factors influenced the recommendation (rain, wind, humidity) so that I understand why the answer is YES or NO. |
| 7 | As a user, I want to see how confident the recommendation is so that I can decide whether to take the risk on borderline days. |
| 8 | As a user, I want to know the estimated drying time for today's conditions so that I know when to bring my clothes inside. |
| 9 | As a user, I want to receive a push notification on good laundry days so that I don't miss the opportunity. |
| 10 | As a user, I want to set my preferred laundry days so that notifications are only sent on days I actually plan to wash. |
| 11 | As a user, I want to specify my drying setup (apartment balcony, covered area, open backyard) so that the recommendation accounts for my conditions. |
| 12 | As a user, I want to share the day's recommendation via a link or image so that I can send it to family or roommates. |

## Feature: Fabric & Garment Awareness

| # | Story |
|---|-------|
| 13 | As a user, I want to select the type of fabric I'm washing (cotton, synthetic, delicate) so that the drying estimate reflects the actual material. |
| 14 | As a user, I want to see how different fabrics perform in today's weather so that I can prioritize what to wash. |
| 15 | As a user, I want to know which garments are safe to wash today and which I should wait on so that I protect delicate items. |

## Feature: Label Decoder

| # | Story |
|---|-------|
| 16 | As a user, I want to look up a clothing care symbol and see a plain-language explanation so that I understand what the icons on my labels mean. |
| 17 | As a user, I want to browse all common care symbols in a visual reference so that I can learn them over time. |
| 18 | As a user, I want to scan a clothing label with my phone camera and have the symbols identified automatically so that I get answers faster. |
| 19 | As a user, I want to see the full care instructions for a garment after scanning its label so that I know how to wash, dry, and iron it correctly. |

## Feature: Laundry Knowledge Base

| # | Story |
|---|-------|
| 20 | As a user, I want to know the difference between powder and liquid detergent so that I pick the right one for my laundry. |
| 21 | As a user, I want to learn how to sort my clothes before washing so that I avoid damaging or discoloring them. |
| 22 | As a user, I want to know the correct water temperature for each fabric type so that I don't shrink or damage my clothes. |
| 23 | As a user, I want to know how often I should wash different types of garments so that I don't over-wash or under-wash them. |
| 24 | As a user, I want stain removal tips for common stains (coffee, grease, wine) so that I can treat them before they set. |
| 25 | As a user, I want to know when and why to use a laundry bag so that I protect delicate items in the machine. |
| 26 | As a user, I want to know which products to avoid on certain fabrics (e.g., bleach on silk) so that I don't ruin my clothes. |
| 27 | As a user, I want to search the knowledge base by topic or keyword so that I find answers quickly. |
| 28 | As a user, I want to see contextual laundry tips alongside the wash forecast so that I learn while I use the app. |

## Feature: User Experience & Accessibility

| # | Story |
|---|-------|
| 29 | As a user, I want the app to load fast on a mobile connection so that I can check the recommendation quickly. |
| 30 | As a user, I want to install the app on my home screen (PWA) so that it feels like a native app. |
| 31 | As a user, I want the app to work without creating an account so that I get value instantly with zero friction. |
| 32 | As a user, I want the app to remember my last-used location so that I don't have to set it every time I visit. |
| 33 | As a user, I want to see the app in my language (starting with Portuguese) so that I can understand everything clearly. |
| 34 | As a user, I want the app to be usable with a screen reader so that it is accessible regardless of my abilities. |
| 35 | As a user, I want to use the app offline with the last fetched recommendation cached so that I have something useful even without internet. |

## Feature: Feedback & Accuracy

| # | Story |
|---|-------|
| 36 | As a user, I want to report whether the recommendation was accurate ("Was this right?") so that the app can improve over time. |
| 37 | As a user, I want to see the app's overall accuracy score so that I know how much to trust it. |

## Feature: Monetization

| # | Story |
|---|-------|
| 38 | As a free user, I want to use the core wash recommendation for free (with ads) so that I get value without paying. |
| 39 | As a user, I want to subscribe to a paid plan (monthly/yearly/lifetime) so that I can remove ads. |
| 40 | As a paying user, I want access to premium features (multi-day forecast, fabric advice, custom alerts) so that I get extra value from my subscription. |
| 41 | As a paying user, I want to manage or cancel my subscription easily so that I stay in control of my spending. |

## Feature: Social & Sharing

| # | Story |
|---|-------|
| 42 | As a user, I want to share the app with friends via a simple link so that they can also benefit from it. |
| 43 | As a user, I want to see a fun, shareable summary of my laundry habits (e.g., "You washed 12 times this month") so that I can post it on social media. |
