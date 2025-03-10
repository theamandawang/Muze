export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      album_reviews: {
        Row: {
          album_id: string | null
          content: string | null
          created_at: string | null
          id: string
          rating: number | null
          title: string | null
          user_id: string
        }
        Insert: {
          album_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          title?: string | null
          user_id: string
        }
        Update: {
          album_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          title?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "album_reviews_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "albums"
            referencedColumns: ["spotify_id"]
          },
          {
            foreignKeyName: "album_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      albums: {
        Row: {
          cover_url: string | null
          created_at: string | null
          spotify_id: string
          title: string
        }
        Insert: {
          cover_url?: string | null
          created_at?: string | null
          spotify_id: string
          title: string
        }
        Update: {
          cover_url?: string | null
          created_at?: string | null
          spotify_id?: string
          title?: string
        }
        Relationships: []
      }
      following: {
        Row: {
          created_at: string | null
          entry_id: string
          follower_id: string
          following_id: string
        }
        Insert: {
          created_at?: string | null
          entry_id?: string
          follower_id?: string
          following_id?: string
        }
        Update: {
          created_at?: string | null
          entry_id?: string
          follower_id?: string
          following_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "following_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "following_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      music_battle_likes: {
        Row: {
          artist_vote: string | null
          battle_id: string | null
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          artist_vote?: string | null
          battle_id?: string | null
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          artist_vote?: string | null
          battle_id?: string | null
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "music_battle_likes_battle_id_fkey"
            columns: ["battle_id"]
            isOneToOne: false
            referencedRelation: "music_battles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "music_battle_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      music_battles: {
        Row: {
          active: boolean | null
          arist_two_id: string | null
          artist_one_id: string | null
          created_at: string
          id: string
        }
        Insert: {
          active?: boolean | null
          arist_two_id?: string | null
          artist_one_id?: string | null
          created_at?: string
          id?: string
        }
        Update: {
          active?: boolean | null
          arist_two_id?: string | null
          artist_one_id?: string | null
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      review_likes: {
        Row: {
          id: string
          review_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          review_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          review_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "review_likes_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "song_reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      song_reviews: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          rating: number | null
          song_id: string | null
          title: string | null
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          song_id?: string | null
          title?: string | null
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          song_id?: string | null
          title?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "song_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      songs: {
        Row: {
          album_id: string | null
          img: string | null
          spotify_id: string
          title: string | null
        }
        Insert: {
          album_id?: string | null
          img?: string | null
          spotify_id: string
          title?: string | null
        }
        Update: {
          album_id?: string | null
          img?: string | null
          spotify_id?: string
          title?: string | null
        }
        Relationships: []
      }
      top_songs: {
        Row: {
          created_at: string
          id: string
          rank: number | null
          song_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          rank?: number | null
          song_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          rank?: number | null
          song_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "top_songs_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "songs"
            referencedColumns: ["spotify_id"]
          },
          {
            foreignKeyName: "top_songs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          bio: string | null
          created_at: string | null
          email: string
          id: string
          profile_pic: string | null
          username: string
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          email: string
          id: string
          profile_pic?: string | null
          username: string
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          email?: string
          id?: string
          profile_pic?: string | null
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      gtrgm_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      gtrgm_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      search_users_by_username: {
        Args: {
          search: string
        }
        Returns: {
          id: string
          username: string
          profile_pic: string
          bio: string
          created_at: string
          email: string
          relevance_score: number
        }[]
      }
      set_limit: {
        Args: {
          "": number
        }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: {
          "": string
        }
        Returns: string[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
