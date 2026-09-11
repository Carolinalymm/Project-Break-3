const mapUser = (user) => {
    if (!user) {
      return null;
    }
  
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  };
  
  export default mapUser;