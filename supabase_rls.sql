-- 1. Ensure RLS is enabled for all tables
ALTER TABLE cats ENABLE ROW LEVEL SECURITY;
ALTER TABLE weights ENABLE ROW LEVEL SECURITY;
ALTER TABLE vomits ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing permissive policies
DROP POLICY IF EXISTS "Allow public all access on cats" ON cats;
DROP POLICY IF EXISTS "Allow public all access on weights" ON weights;
DROP POLICY IF EXISTS "Allow public all access on vomits" ON vomits;

-- 3. Create READ policies (Allow anyone to read)
CREATE POLICY "Allow public read on cats" ON cats FOR SELECT USING (true);
CREATE POLICY "Allow public read on weights" ON weights FOR SELECT USING (true);
CREATE POLICY "Allow public read on vomits" ON vomits FOR SELECT USING (true);

-- 4. Create WRITE policies (Allow only authenticated users to insert, update, delete)
CREATE POLICY "Allow auth write on cats" ON cats FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow auth update on cats" ON cats FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow auth delete on cats" ON cats FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow auth write on weights" ON weights FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow auth update on weights" ON weights FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow auth delete on weights" ON weights FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow auth write on vomits" ON vomits FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow auth update on vomits" ON vomits FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow auth delete on vomits" ON vomits FOR DELETE TO authenticated USING (true);
