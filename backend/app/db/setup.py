import logging
from app.db.init_db import init_db

logger = logging.getLogger(__name__)

def setup_db():
    """
    Initialize the database with all required tables.
    This function should be called when the application starts.
    """
    try:
        logger.info("Setting up database...")
        init_db()
        logger.info("Database setup complete")
    except Exception as e:
        logger.error(f"Error setting up database: {e}")
        raise
