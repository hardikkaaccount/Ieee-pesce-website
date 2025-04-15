import { NextResponse } from 'next/server';
import { 
  getResources, 
  updateResources, 
  addResource, 
  updateResource, 
  deleteResource, 
  Resource 
} from '@/app/lib/resourcesUtils';

// GET handler to fetch all resources
export async function GET() {
  try {
    console.log('GET /api/resources - Fetching resources');
    const resources = getResources();
    return NextResponse.json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}

// POST handler to add a new resource
export async function POST(request: Request) {
  try {
    console.log('POST /api/resources - Adding a new resource');
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.type || !data.category || !data.link) {
      return NextResponse.json(
        { error: 'Missing required fields: title, type, category, and link are required' },
        { status: 400 }
      );
    }
    
    const newResource = addResource({
      title: data.title,
      type: data.type,
      category: data.category,
      description: data.description || '',
      link: data.link,
      icon: data.icon || '',
      featured: data.featured || false
    });
    
    return NextResponse.json(newResource);
  } catch (error) {
    console.error('Error adding resource:', error);
    return NextResponse.json(
      { error: 'Failed to add resource' },
      { status: 500 }
    );
  }
}

// PUT handler to update an existing resource
export async function PUT(request: Request) {
  try {
    console.log('PUT /api/resources - Updating a resource');
    const data = await request.json();
    
    // Ensure ID is provided
    if (!data.id) {
      return NextResponse.json(
        { error: 'Resource ID is required' },
        { status: 400 }
      );
    }
    
    const updatedResource = updateResource(data.id, data);
    
    if (!updatedResource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedResource);
  } catch (error) {
    console.error('Error updating resource:', error);
    return NextResponse.json(
      { error: 'Failed to update resource' },
      { status: 500 }
    );
  }
}

// DELETE handler for removing a resource
export async function DELETE(request: Request) {
  try {
    // Get the resource ID from the URL parameters
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: 'Valid resource ID is required' },
        { status: 400 }
      );
    }
    
    console.log(`DELETE /api/resources - Deleting resource with ID: ${id}`);
    
    const success = deleteResource(Number(id));
    
    if (!success) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting resource:', error);
    return NextResponse.json(
      { error: 'Failed to delete resource' },
      { status: 500 }
    );
  }
} 