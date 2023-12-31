if [ -f .env ]
then
  export $(cat .env | sed 's/#.*//g' | xargs)
fi

URL=${API_URL:-http://localhost:3000/}
URL="${API_URL}conversation/completion"
# SMALLER_MESSAGE="{ \"messages\": [ { \"from\": \"human\", \"value\": \"Summarize the main ideas of Brendon Burchard's Experts Academy into bullet points as it pertains to a growth marketing agency implementing these strategies and tactics for their clients...\" } ] }"
# BIGGER_MESSAGE="{\"messages\": [{\"from\": \"human\",\"value\": \"Summarize the main ideas of Jeff Walker's Product Launch Formula into bullet points as it pertains to a growth marketing agency implementing these strategies and tactics for their clients...\"},{\"from\": \"gpt\",\"value\": \"Here are the main ideas of Jeff Walker's Product Launch Formula that can be applied by a growth marketing agency for their clients:\\n\\n1. Identify the target audience and their needs: Understand the ideal customer for the product or service, and create a messaging that resonates with them.\\n2. Pre-launch: Build anticipation and excitement for the launch by creating buzz, gathering testimonials and case studies, and using social media to create awareness.\\n3. Launch: Use a well-crafted launch sequence to maximize sales and conversions. This can include offering bonuses, creating scarcity, and using a deadline to create urgency.\\n4. Post-launch: Follow up with customers, gather feedback, and continue to provide value to keep them engaged and loyal.\\n5. Create a product suite: Once the initial product is successful, expand the offering by creating additional products or services that address other needs of the same audience.\\n6. Continual optimization: Continually monitor and optimize the launch process and product suite to improve results.\\n7. Build a community: Use the launch process to build a community of customers who are passionate about the product and can help spread the word.\\n8. Use automation: Use technology and automation to streamline the launch process and improve efficiency.\"},{\"from\": \"human\",\"value\": \"Summarize the main ideas of Brendon Burchard's Experts Academy into bullet points as it pertains to a growth marketing agency implementing these strategies and tactics for their clients...\"}]}" 

npx autocannon $URL -m POST \
    -H 'Content-Type: application/json' \
    --warmup [-c 1 -d 3] \
    --body "{ \"messages\": [ { \"from\": \"human\", \"value\": \"Summarize the main ideas of Brendon Burchard's Experts Academy into bullet points as it pertains to a growth marketing agency implementing these strategies and tactics for their clients...\" } ] }" \
    --connections 500 \
    --pipeline 10 \
    --renderStatusCodes