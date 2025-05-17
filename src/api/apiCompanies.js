import supabaseClient, { supabaseUrl } from "@/utils/supabase";

// Fetch Companies
export async function getCompanies(token) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase.from("companies").select("*");

  if (error) {
    console.error("Error fetching companies:", error); // Debugging log
    return [];
  }

  console.log("Fetched companies:", data); // Debugging log
  return data;
}

// Add Company
export async function addNewCompany(token, _, companyData) {
  const supabase = await supabaseClient(token);

  // Check if the bucket exists
  const { data: bucketList, error: bucketError } = await supabase.storage.listBuckets();

  if (bucketError) {
    console.error("Error fetching buckets:", bucketError);
    throw new Error("Error fetching storage buckets");
  }

  const bucketExists = bucketList.some((bucket) => bucket.name === "company-logo");

  if (!bucketExists) {
    throw new Error("Storage bucket 'company-logo' does not exist");
  }

  const random = Math.floor(Math.random() * 90000);
  const fileName = `logo-${random}-${companyData.name}`;

  console.log("Uploading file:", companyData.logo); // Debugging log

  // Check if the file exists
  if (!companyData.logo) {
    throw new Error("No file provided for upload");
  }

  // Attempt to upload the file
  const { data: uploadData, error: storageError } = await supabase.storage
    .from("company-logo") // Ensure this matches the bucket name
    .upload(fileName, companyData.logo);

  if (storageError) {
    console.error("Error uploading Company Logo:", storageError); // Debugging log
    throw new Error("Error uploading Company Logo");
  }

  console.log("Upload response:", uploadData); // Debugging log

  // Generate the public URL for the uploaded file
  const logo_url = `${supabaseUrl}/storage/v1/object/public/company-logo/${fileName}`;
  console.log("Uploaded logo URL:", logo_url); // Debugging log

  // Insert the company data into the database
  const { data, error } = await supabase
    .from("companies")
    .insert([
      {
        name: companyData.name,
        logo_url: logo_url,
      },
    ])
    .select();

  if (error) {
    console.error("Error inserting company data:", error); // Debugging log
    throw new Error("Error submitting Companys");
  }

  return data;
}