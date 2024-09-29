#!/bin/bash

# Define the directory where the components will be created
# COMPONENT_DIR="src/pages"
COMPONENT_DIR="src/components"

# Create the directory if it doesn't exist
mkdir -p $COMPONENT_DIR

# Array of component names
# COMPONENTS=("Home" "MyPurchases" "Sell" "Profile")
# COMPONENTS=("DeclarationOfUse")
COMPONENTS=("Setting")

# Function to create a component file
create_component() {
    local name=$1
    local file_path="$COMPONENT_DIR/$name.tsx"
    
    echo "Creating $name component..."
    
    # Create the file and add content
    cat > "$file_path" << EOL
import React from 'react';

const $name: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">${name}</h1>
      {/* Add content for the ${name} page */}
    </div>
  );
};

export default $name;
EOL

    echo "$name component created at $file_path"
}

# Create each component
for component in "${COMPONENTS[@]}"; do
    create_component "$component"
done

echo "All components have been created successfully!"