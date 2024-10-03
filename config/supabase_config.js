const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
    'https://cxgnevhovejepoxomcsc.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4Z25ldmhvdmVqZXBveG9tY3NjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMzU0NDU0NSwiZXhwIjoyMDM5MTIwNTQ1fQ.Dcr0sl_mJDDGhPrfl5OQnH1OVbiKJlSYXpDBUV7e0GI'
)


module.exports = supabase;